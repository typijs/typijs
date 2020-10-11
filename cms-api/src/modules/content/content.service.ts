import { DocumentNotFoundException, Exception } from '../../error';
import { FolderService } from '../folder/folder.service';
import { BaseService } from '../shared';
import {
    IContentDocument,
    IContentLanguageDocument,
    IContentVersionDocument,
    IContentModel,
    IContentLanguageModel,
    IContentVersionModel,
    VersionStatus
} from './content.model';

export class ContentVersionService<V extends IContentVersionDocument> extends BaseService<V> {
    public createNewVersion(version: Partial<V>, contentId: string, userId: string, masterVersionId?: string): Promise<V> {
        const contentVersionDoc = this.createModel(version);
        contentVersionDoc._id = undefined;
        contentVersionDoc.contentId = contentId;
        contentVersionDoc.createdBy = userId;
        contentVersionDoc.masterVersionId = masterVersionId;
        contentVersionDoc.status = VersionStatus.CheckedOut;
        return contentVersionDoc.save();
    }
}

export class ContentLanguageService<P extends IContentLanguageDocument> extends BaseService<P> {
    public async createContentLanguage(content: any, contentId: string, versionId: string, userId: string): Promise<P> {
        const contentLangDoc = this.createModel(content);
        contentLangDoc._id = undefined;
        contentLangDoc.contentId = contentId;
        contentLangDoc.versionId = versionId;
        contentLangDoc.createdBy = userId;
        contentLangDoc.status = VersionStatus.CheckedOut;
        const savedResult = await (await contentLangDoc.save()).populate('contentId').execPopulate();

        //update content languages array in main content
        const currentContent = savedResult.contentId as IContentDocument;
        if (!Array.isArray(currentContent.contentLanguages)) {
            currentContent.contentLanguages = [];
        }
        currentContent.contentLanguages.push(savedResult._id);
        await currentContent.save()
        return savedResult;
    }
}

export class ContentService<T extends IContentDocument, P extends IContentLanguageDocument, V extends IContentVersionDocument> extends FolderService<T, P> {
    private contentLanguageService: ContentLanguageService<P>;
    private contentVersionService: ContentVersionService<V>;

    constructor(contentModel: IContentModel<T>, contentLanguageModel: IContentLanguageModel<P>, contentVersionModel: IContentVersionModel<V>) {
        super(contentModel, contentLanguageModel);
        this.contentLanguageService = new ContentLanguageService<P>(contentLanguageModel);
        this.contentVersionService = new ContentVersionService<V>(contentVersionModel);
    }

    //return plain json object instead of mongoose document
    public getPopulatedContentById = async (id: string, languageId: string): Promise<V> => {
        if (!id) throw new Exception(400, "Bad Request");

        const currentContent = await this.findOne({ _id: id, isDeleted: false } as any, { lean: true }).exec();
        if (!currentContent) throw new DocumentNotFoundException(id);

        const currentVersion = await this.contentVersionService.findOne({ contentId: id, languageId: languageId } as any, { lean: true })
            .sort({ createdAt: -1 })
            .populate({
                path: 'childItems.content',
                match: { isDeleted: false },
                populate: {
                    path: 'contentLanguages',
                    match: { languageId: languageId },
                    populate: {
                        path: 'childItems.content',
                        match: { isDeleted: false },
                        populate: {
                            path: 'contentLanguages',
                            match: { languageId: languageId }
                        }
                    }
                }
            }).exec();

        currentVersion.childItems.forEach(item => {
            Object.assign(item.content, item.content.contentLanguages.find(contentLanguage => contentLanguage.languageId === languageId))
        })
        return currentVersion;
    }

    /**
     * Create block or media content
     * @param content 
     */
    public executeCreateContentFlow = async (content: Partial<T & V>, userId: string): Promise<T & V> => {
        //Step1: Create content
        const contentDoc = this.createModel(content);
        const parentContent = await this.findById(contentDoc.parentId).exec();
        const savedContent = await this.createContent(contentDoc, parentContent, userId);
        //Step2: Create content version
        const savedContentVersionDoc = await this.contentVersionService.createNewVersion(content, savedContent._id, userId);
        //Step3: Create content in language 
        const savedContentLangDoc = await this.contentLanguageService.createContentLanguage(content, savedContent._id, savedContentVersionDoc._id, userId);

        return Object.assign(savedContent, savedContentVersionDoc);
    }

    protected createContent = (newContent: T, parentContent: T, userId: string): Promise<T> => {
        newContent.createdBy = userId;
        newContent.parentId = parentContent ? parentContent._id : null;

        //create parent path ids
        if (parentContent) {
            newContent.parentPath = parentContent.parentPath ? `${parentContent.parentPath}${parentContent._id},` : `,${parentContent._id},`;

            let ancestors = parentContent.ancestors.slice();
            ancestors.push(parentContent._id);
            newContent.ancestors = ancestors
        } else {
            newContent.parentPath = null;
            newContent.ancestors = [];
        }

        return newContent.save();
    }

    protected updateHasChildren = async (content: IContentDocument): Promise<boolean> => {
        if (!content) return false;
        if (content && content.hasChildren) return true;

        content.hasChildren = true;
        const savedContent = await content.save();
        return savedContent.hasChildren;
    }

    /**
     * Execute update content flow of content service
     * @returns the newest version in current language
     */
    public executeUpdateContentFlow = async (id: string, contentObj: T & V, userId: string): Promise<T & V> => {
        const { name, properties, childItems } = contentObj;

        const currentContent = await this.findById(id);
        //Step1: Get current version
        const currentVersion = await this.contentVersionService.findOne({ contentId: id, languageId: contentObj.languageId } as any).sort({ createdAt: -1 }).exec();
        if (currentVersion.status != VersionStatus.Published) {
            Object.assign(currentVersion, { name, properties, childItems });
            currentVersion.updatedBy = userId;
            const saveContentVersion = await currentVersion.save();

            //Step2: update corresponding draft content language version
            const contentLanguage = await this.contentLanguageService.findOne({ contentId: id, languageId: contentObj.languageId } as any).exec();
            if (contentLanguage.status == VersionStatus.CheckedOut) {
                Object.assign(contentLanguage, { name, properties, childItems });
                contentLanguage.updatedBy = userId;
                await contentLanguage.save();
            }
            return Object.assign(currentContent, saveContentVersion);
        } else {
            //Create new version
            const savedContentVersionDoc = await this.contentVersionService.createNewVersion(contentObj, id, userId, currentVersion._id);

            return Object.assign(currentContent, savedContentVersionDoc);
        }
    }

    /**
     * Execute publish content flow of content service
     * @returns the published version in current language
     */
    public executePublishContentFlow = async (id: string, languageId: string, userId: string): Promise<T & V> => {
        const currentContent = await this.findById(id);
        //Step1: Get current version
        const currentVersion = await this.contentVersionService.findOne({ contentId: id, languageId: languageId } as any).sort({ createdAt: -1 }).exec();
        if (currentVersion.status < VersionStatus.Published) {
            //Step2: publish the current version
            currentVersion.status = VersionStatus.Published;
            currentVersion.startPublish = new Date();
            currentVersion.publishedBy = userId;
            await currentVersion.save();

            //Step3: update previous versions to PreviewPublished
            await this.contentVersionService.updateMany(
                { _id: { $ne: currentVersion._id }, contentId: id, languageId: languageId, status: VersionStatus.Published } as any,
                { status: VersionStatus.PreviouslyPublished } as any).exec();

            //Step4: publish the current content language
            const contentLanguage = await this.contentLanguageService.findOne({ contentId: id, languageId: languageId } as any).exec();
            const { status, startPublish, publishedBy, name, properties, childItems } = currentVersion;
            Object.assign(contentLanguage, { status, startPublish, publishedBy, name, properties, childItems });
            contentLanguage.versionId = currentVersion._id;
            await contentLanguage.save();
        }

        return Object.assign(currentContent, currentVersion);
    }

    /**
     * Execute delete content flow of content service
     */
    public executeDeleteContentFlow = async (id: string, userId: string): Promise<T> => {
        //find page
        const currentContent = await this.findById(id).exec();
        if (!currentContent) throw new DocumentNotFoundException(id);
        //soft delete page
        //soft delete page's children
        //TODO: update the 'HasChildren' field of page's parent
        const result: [T, any] = await Promise.all([
            this.softDeleteContent(currentContent, userId),
            this.softDeleteContentChildren(currentContent, userId)
        ]);

        const childCount = await this.countChildrenOfContent(currentContent.parentId);
        if (childCount == 0) await this.updateById(currentContent.parentId, { hasChildren: false } as any)

        return result[0];
    }

    private countChildrenOfContent = (parentId: string): Promise<number> => {
        return this.count({ parentId: parentId, isDeleted: false } as any)
    }

    private softDeleteContent = async (currentContent: T, userId: string): Promise<T> => {
        currentContent.isDeleted = true;
        currentContent.deletedBy = userId;
        currentContent.deletedAt = new Date();
        return currentContent.save();
    }

    private softDeleteContentChildren = (currentContent: T, userId: string): Promise<any> => {
        if (!currentContent.parentPath) currentContent.parentPath = ',';

        const startWithParentPathRegExp = new RegExp("^" + `${currentContent.parentPath}${currentContent._id},`);
        const conditions = { parentPath: { $regex: startWithParentPathRegExp } };
        const updateFields: Partial<IContentDocument> = { isDeleted: true, deletedBy: userId, deletedAt: new Date() };
        return this.updateMany(conditions as any, updateFields as any).exec()
    }

    /**
     * Execute the copy content flow
     * @param sourceContentId 
     * @param targetParentId 
     */
    public executeCopyContentFlow = async (sourceContentId: string, targetParentId: string, userId: string): Promise<T> => {
        const copiedContent = await this.createCopiedContent(sourceContentId, targetParentId, userId);
        await this.createCopiedChildrenContent(sourceContentId, copiedContent, userId);

        return copiedContent;
    }

    //Can be override in the inherited class
    protected createCopiedContent = async (sourceContentId: string, targetParentId: string, userId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.findById(sourceContentId, { lean: true }).exec();
        if (!sourceContent) throw new DocumentNotFoundException(sourceContentId);

        //get source latest version content in each language
        const sourceVersions = await this.contentVersionService.find({ contentId: sourceContent._id }, { lean: true }).exec();

        const latestVersion: { [key: string]: V } = {};
        sourceVersions.forEach(version => {
            const previousVer = latestVersion[version.languageId]
            if (!previousVer) {
                latestVersion[version.languageId] = version;
                return;
            }
            if (previousVer.languageId === version.languageId && previousVer.createdAt < version.createdAt)
                latestVersion[version.languageId] = version;
        })
        const copyVersions = Object.entries(latestVersion).map(([languageId, version]: [string, V]) => version);

        //create copy content
        const newContent = sourceContent.toObject();
        newContent._id = undefined;
        newContent.parentId = targetParentId;
        const parentContent = await this.findById(targetParentId).exec();
        const copiedContent = await this.createContent(newContent, parentContent, userId);

        //create copy version
        copyVersions.forEach(async version => {
            const savedVersion = await this.contentVersionService.createNewVersion(version.toObject(), copiedContent._id, userId);
            await this.contentLanguageService.createContentLanguage(version.toObject(), copiedContent._id, savedVersion._id, userId)
        })

        return copiedContent;
    }

    private createCopiedChildrenContent = async (sourceContentId: string, copiedContent: T, userId: string): Promise<any> => {
        //get children
        const children = await this.find({ parentId: sourceContentId } as any, { lean: true }).exec();
        children.forEach(async childContent => {
            await this.executeCopyContentFlow(childContent._id, copiedContent._id, userId)
        })
    }

    private getDescendants = async (parentId: string): Promise<T[]> => {
        //get source content 
        const parentContent = await this.findById(parentId).exec();
        if (!parentContent) throw new DocumentNotFoundException(parentId);
        if (!parentContent.parentPath) parentContent.parentPath = ',';

        const startWithParentPathRegExp = new RegExp("^" + `${parentContent.parentPath}${parentContent._id},`);
        const conditions = { parentPath: { $regex: startWithParentPathRegExp } };
        return this.find(conditions as any).exec();
    }

    /**
     * Execute Cut content flow
     * @param sourceContentId 
     * @param targetParentId 
     */
    public executeCutContentFlow = async (sourceContentId: string, targetParentId: string, userId: string): Promise<T> => {
        const cutContent = await this.createCutContent(sourceContentId, targetParentId, userId);

        const cutResult = await this.createCutDescendantsContent(sourceContentId, cutContent);
        return cutContent;
    }

    protected createCutContent = async (sourceContentId: string, targetParentId: string, userId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.findById(sourceContentId).exec();
        if (!sourceContent) throw new DocumentNotFoundException(sourceContentId);

        const targetParent = await this.findById(targetParentId).exec();

        this.updateParentPathAndAncestorAndLinkUrl(targetParent, sourceContent);
        sourceContent.updatedBy = userId;
        const updatedContent = await sourceContent.save();
        return updatedContent;
    }

    private createCutDescendantsContent = async (sourceContentId: string, cutContent: T): Promise<[T[], any]> => {
        //get descendants of sourceContent
        const descendants = await this.getDescendants(sourceContentId);
        if (descendants.length == 0) return [descendants, null];

        descendants.forEach(childContent => {
            this.updateParentPathAndAncestorAndLinkUrl(cutContent, childContent);
            childContent.updatedBy = cutContent.updatedBy;
        })

        const updateOperators = descendants.map(x => ({
            updateOne: {
                filter: { _id: x._id },
                update: x.toObject()
            }
        }));

        const bulkWriteResult = await this.Model.bulkWrite([updateOperators], { ordered: false });
        return [descendants, bulkWriteResult];
    }

    protected updateParentPathAndAncestorAndLinkUrl = (newParentContent: T, currentContent: T): T => {
        this.updateParentPathAndAncestor(newParentContent, currentContent);
        this.updateLinkUrl(newParentContent, currentContent);

        return currentContent;
    }

    private updateParentPathAndAncestor = (newParentContent: T, currentContent: T): T => {
        const parentId = newParentContent ? newParentContent._id : null;
        const index = parentId ? currentContent.ancestors.findIndex(p => p == parentId) : 0;

        //update parent path, ancestors
        const paths = currentContent.parentPath.split(',').filter(x => x);
        let newPath = newParentContent && newParentContent.parentPath ? newParentContent.parentPath : ',';
        let newAncestors = newParentContent ? newParentContent.ancestors.slice() : [];

        for (let i = index; i < currentContent.ancestors.length; i++) {
            newPath = `${newPath}${paths[i]},`;
            newAncestors.push(currentContent.ancestors[i]);
        }

        currentContent.parentPath = newPath;
        currentContent.ancestors = newAncestors;
        currentContent.parentId = parentId;
        return currentContent;
    }

    //Can be override in the inherited class
    protected updateLinkUrl = (newParentContent: T, currentContent: T): T => currentContent;
}