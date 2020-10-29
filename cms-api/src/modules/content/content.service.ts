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
    public createNewVersion(version: V, contentId: string, userId: string, language: string, masterVersionId?: string): Promise<V> {
        const contentVersionDoc = { ...version };
        contentVersionDoc._id = undefined;
        contentVersionDoc.contentId = contentId;
        contentVersionDoc.language = language;
        contentVersionDoc.createdBy = userId;
        contentVersionDoc.masterVersionId = masterVersionId;
        contentVersionDoc.status = VersionStatus.CheckedOut;
        return this.create(contentVersionDoc)
    }
}

export class ContentLanguageService<P extends IContentLanguageDocument> extends BaseService<P> {
    public async createContentLanguage(content: P, contentId: string, versionId: string, userId: string, language: string): Promise<P> {
        const contentLangDoc = { ...content };
        contentLangDoc._id = undefined;
        contentLangDoc.contentId = contentId;
        contentLangDoc.versionId = versionId;
        contentLangDoc.language = language;
        contentLangDoc.createdBy = userId;
        contentLangDoc.status = VersionStatus.CheckedOut;
        const savedResult = await (await this.create(contentLangDoc)).populate('contentId').execPopulate();

        //update content languages array in main content
        const currentContent = savedResult.contentId as IContentDocument;
        if (!Array.isArray(currentContent.contentLanguages)) {
            currentContent.contentLanguages = [];
        }
        currentContent.contentLanguages.push(savedResult._id);
        await currentContent.save();
        return savedResult;
    }
}

export class ContentService<T extends IContentDocument, P extends IContentLanguageDocument, V extends IContentVersionDocument> extends FolderService<T, P> {
    protected contentLanguageService: ContentLanguageService<P>;
    protected contentVersionService: ContentVersionService<V>;

    constructor(contentModel: IContentModel<T>, contentLanguageModel: IContentLanguageModel<P>, contentVersionModel: IContentVersionModel<V>) {
        super(contentModel, contentLanguageModel);
        this.contentLanguageService = new ContentLanguageService<P>(contentLanguageModel);
        this.contentVersionService = new ContentVersionService<V>(contentVersionModel);
    }

    /**
     * Get current version of content  by id and language code
     * @param id The content's id
     * @param language The language code (ex 'en', 'de'...)
     */
    public getCurrentVersionOfContentById = async (id: string, language: string): Promise<V> => {
        if (!id) throw new Exception(400, "Bad Request");

        const currentContent = await this.findOne({ _id: id, isDeleted: false } as any, { lean: true }).exec();
        if (!currentContent) throw new DocumentNotFoundException(id);

        const currentVersion = await this.contentVersionService.findOne({ contentId: id, language: language } as any, { lean: true })
            .sort({ createdAt: -1 })
            .populate({
                path: 'childItems.content',
                match: { isDeleted: false },
                populate: {
                    path: 'contentLanguages',
                    match: { language: language },
                    populate: {
                        path: 'childItems.content',
                        match: { isDeleted: false },
                        populate: {
                            path: 'contentLanguages',
                            match: { language: language }
                        }
                    }
                }
            }).exec();

        currentVersion.childItems.forEach(item => {
            Object.assign(item.content, item.content.contentLanguages.find(contentLanguage => contentLanguage.language === language))
        })
        return currentVersion;
    }

    /**
     * Get published content by id and language code
     * @param id The content's id
     * @param language The language code (ex 'en', 'de'...)
     */
    public getPublishedContentById = async (id: string, language: string): Promise<T & P> => {
        if (!id) throw new Exception(400, "Bad Request");

        const currentContent = await this.findOne({ _id: id, isDeleted: false } as any, { lean: true })
            .populate({
                path: 'contentLanguages',
                match: { language: language },
                select: '-_id',
                populate: {
                    path: 'childItems.content',
                    match: { isDeleted: false },
                    populate: {
                        path: 'contentLanguages',
                        match: { language: language }
                    }
                }
            })
            .exec();
        if (!currentContent) return null;

        const publishedLang = currentContent.contentLanguages.find((lang: P) => lang.language === language && lang.status == VersionStatus.Published);
        if (!publishedLang) return null;

        return Object.assign(currentContent, publishedLang);
    }

    /**
     * Create block or media content
     * @param content 
     */
    public executeCreateContentFlow = async (content: T & P, userId: string, language: string): Promise<T & V> => {
        //Step1: Create content
        const parentContent = await this.findById(content.parentId).exec();
        //generate url segment
        const savedContent = await this.createContent(content, parentContent, userId);
        //Step2: Create content version
        const savedContentVersionDoc = await this.contentVersionService.createNewVersion(content as any, savedContent._id, userId, language);
        //Step3: Create content in language 
        const savedContentLangDoc = await this.contentLanguageService.createContentLanguage(content, savedContent._id, savedContentVersionDoc._id, userId, language);

        return Object.assign(savedContent, savedContentVersionDoc);
    }

    protected createContent = (newContent: T, parentContent: T, userId: string): Promise<T> => {
        newContent.createdBy = userId;
        newContent.parentId = parentContent ? parentContent._id : null;

        //create parent path ids
        if (parentContent) {
            newContent.parentPath = parentContent.parentPath ? `${parentContent.parentPath}${parentContent._id},` : `,${parentContent._id},`;

            const ancestors = parentContent.ancestors.slice();
            ancestors.push(parentContent._id);
            newContent.ancestors = ancestors
        } else {
            newContent.parentPath = null;
            newContent.ancestors = [];
        }

        return this.create(newContent);
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
    public executeUpdateContentFlow = async (id: string, contentObj: T & V, userId: string, language: string): Promise<T & V> => {
        const { name, properties, childItems } = contentObj;

        const currentContent = await this.findById(id);
        //Step1: Get current version
        const currentVersion = await this.contentVersionService.findOne({ contentId: id, language } as any).sort({ createdAt: -1 }).exec();
        if (currentVersion.status != VersionStatus.Published) {
            Object.assign(currentVersion, { name, properties, childItems });
            currentVersion.updatedBy = userId;
            const saveContentVersion = await currentVersion.save();

            //Step2: update corresponding draft content language version
            const contentLanguage = await this.contentLanguageService.findOne({ contentId: id, language } as any).exec();
            if (contentLanguage.status == VersionStatus.CheckedOut) {
                Object.assign(contentLanguage, { name, properties, childItems });
                contentLanguage.updatedBy = userId;
                await contentLanguage.save();
            }
            return Object.assign(currentContent, saveContentVersion);
        } else {
            //Create new version
            const savedContentVersionDoc = await this.contentVersionService.createNewVersion(contentObj, id, userId, language, currentVersion._id);

            return Object.assign(currentContent, savedContentVersionDoc);
        }
    }

    /**
     * Execute publish content flow of content service
     * @returns the published version in current language
     */
    public executePublishContentFlow = async (id: string, userId: string, language: string): Promise<T & V> => {
        const currentContent = await this.findById(id);
        //Step1: Get current version
        const currentVersion = await this.contentVersionService.findOne({ contentId: id, language: language } as any).sort({ createdAt: -1 }).exec();
        if (currentVersion.status < VersionStatus.Published) {
            //Step2: publish the current version
            currentVersion.status = VersionStatus.Published;
            currentVersion.startPublish = new Date();
            currentVersion.publishedBy = userId;
            await currentVersion.save();

            //Step3: update previous versions to PreviewPublished
            await this.contentVersionService.updateMany(
                { _id: { $ne: currentVersion._id }, contentId: id, language: language, status: VersionStatus.Published } as any,
                { status: VersionStatus.PreviouslyPublished } as any).exec();

            //Step4: publish the current content language
            const contentLanguage = await this.contentLanguageService.findOne({ contentId: id, language: language } as any).exec();
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

    private createCopiedContent = async (sourceContentId: string, targetParentId: string, userId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.findById(sourceContentId, { lean: true }).exec();
        if (!sourceContent) throw new DocumentNotFoundException(sourceContentId);

        //get source latest version content in each language
        const sourceVersions = await this.contentVersionService.find({ contentId: sourceContent._id }, { lean: true }).exec();

        const latestVersion: { [key: string]: V } = {};
        sourceVersions.forEach(version => {
            const previousVer = latestVersion[version.language]
            if (!previousVer) {
                latestVersion[version.language] = version;
                return;
            }
            if (previousVer.language === version.language && previousVer.createdAt < version.createdAt)
                latestVersion[version.language] = version;
        })
        const copyVersions = Object.entries(latestVersion).map(([language, version]: [string, V]) => version);

        //create copy content
        const newContent = sourceContent.toObject();
        newContent._id = undefined;
        newContent.parentId = targetParentId;
        const parentContent = await this.findById(targetParentId).exec();
        const copiedContent = await this.createContent(newContent, parentContent, userId);

        //create copy content version and content lang
        copyVersions.forEach(async version => {
            const savedVersion = await this.contentVersionService.createNewVersion(version.toObject(), copiedContent._id, userId, version.language);
            const savedContentLang = await this.contentLanguageService.createContentLanguage(version.toObject(), copiedContent._id, savedVersion._id, userId, version.language);
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
}