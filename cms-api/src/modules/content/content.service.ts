import * as mongoose from 'mongoose';
import { IContentDocument, RefContent, IContentHasChildItems, IContentVersionDocument, IPublishedContentDocument, IContentVersion, IPublishedContent, IContent } from './content.model';
import { cmsPage } from '../page/models/page.model';
import { cmsBlock } from '../block/models/block.model';
import { cmsMedia } from '../media/models/media.model';
import { cmsPublishedPage } from '../page/models/published-page.model';
import { cmsPublishedBlock } from '../block/models/published-block.model';
import { BaseService } from '../shared/base.service';
import { cmsPublishedMedia } from '../media/models/published-media.model';
import { HttpException, NotFoundException } from '../../errorHandling';

export class ContentService<T extends IContentDocument, V extends IContentVersionDocument & T, P extends IPublishedContentDocument & V> extends BaseService<T> {
    protected contentModel: mongoose.Model<T>;
    protected contentVersionModel: mongoose.Model<V>;
    protected publishedContentModel: mongoose.Model<P>;

    constructor(contentModel: mongoose.Model<T>, contentVersionModel: mongoose.Model<V>, publishedContentModel: mongoose.Model<P>) {
        super(contentModel);
        this.contentModel = contentModel;
        this.contentVersionModel = contentVersionModel;
        this.publishedContentModel = publishedContentModel;
    }

    public getPopulatedContentById = (id: string): Promise<T> => {
        if (!id) id = null;

        return this.contentModel.findOne({ _id: id })
            .populate({
                path: 'childItems.content',
                match: { isDeleted: false }
            })
            .exec();
    }

    public getPopulatedPublishedContentById = (id: string): Promise<P> => {
        if (!id) id = null;

        return this.publishedContentModel.findOne({ _id: id })
            .populate({
                path: 'publishedChildItems.content',
                match: { isDeleted: false }
            })
            .exec();
    }

    public executeCreateContentFlow = async (content: T): Promise<T> => {
        //get page's parent
        //generate url segment
        //create new page
        //update parent page's has children property
        const parentContent = await this.getModelById(content.parentId);
        const savedContent = await this.createContent(content, parentContent);
        return savedContent;
    }

    public createContent = (newContent: T, parentContent: T): Promise<T> => {
        newContent.created = new Date();
        //TODO: pageObj.createdBy = userId;
        newContent.changed = new Date();
        //TODO: pageObj.changedBy = userId;
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

    public updateHasChildren = async (content: IContentDocument): Promise<boolean> => {
        if (!content) return false;
        if (content && content.hasChildren) return true;

        content.changed = new Date();
        content.hasChildren = true;
        const savedContent = await content.save();
        return savedContent.hasChildren;
    }

    public updateAndPublishContent = async (id: string, contentObj: T): Promise<T> => {
        let currentContent = await this.getModelById(id);
        if (contentObj.isDirty) {
            currentContent = await this.updateContent(currentContent, contentObj);
        }

        if (contentObj.isPublished && (!currentContent.published || currentContent.changed > currentContent.published)) {
            currentContent = await this.executePublishContentFlow(currentContent);
        }
        return currentContent;
    }

    public executePublishContentFlow = async (currentContent: T): Promise<P> => {
        //set property isPublished = true
        const updatedContent = await this.publishContent(currentContent);
        //create page version
        const pageVersion = await this.createPageVersion(updatedContent);
        //create published content
        const publishedContent = await this.createPublishedContent(updatedContent, pageVersion._id);
        return publishedContent;
    }

    private publishContent = (currentContent: T): Promise<T> => {
        currentContent.isPublished = true;
        currentContent.published = new Date();
        //TODO: currentContent.publishedBy = userId;
        return currentContent.save()
    }

    private createPageVersion = (currentContent: T): Promise<V> => {
        const newContentVersion: IContentVersion = {
            ...currentContent.toObject(),
            contentId: currentContent._id,
            _id: new mongoose.Types.ObjectId()
        }
        const contentVersionDocument = new this.contentVersionModel(newContentVersion);
        return contentVersionDocument.save();
    }

    private createPublishedContent = async (currentContent: T, contentVersionId: string): Promise<P> => {
        //find the existing published page
        const deletedContent = await this.publishedContentModel.findOneAndDelete({ _id: currentContent._id });

        const newPublishedPage: IPublishedContent = {
            ...currentContent.toObject(),
            contentId: currentContent._id,
            contentVersionId: contentVersionId
        }

        const publishedPageDocument = new this.publishedContentModel(newPublishedPage);
        return publishedPageDocument.save();
    }

    private updateContent = (currentContent: T, pageObj: T): Promise<T> => {
        currentContent.changed = new Date();
        //TODO: currentContent.changedBy = userId
        currentContent.name = pageObj.name;
        currentContent.properties = pageObj.properties;
        currentContent.childItems = pageObj.childItems;
        currentContent.publishedChildItems = this.getPublishedChildItems(pageObj.childItems);

        return currentContent.save();
    }

    private getPublishedChildItems = (currentItems: RefContent[]): RefContent[] => {
        return currentItems.map((item: RefContent) => <RefContent>{
            content: item.content,
            refPath: this.getPublishedRefPath(item.refPath)
        })
    }

    private getPublishedRefPath = (refPath: string): string => {
        switch (refPath) {
            case cmsPage: return cmsPublishedPage;
            case cmsBlock: return cmsPublishedBlock;
            case cmsMedia: return cmsPublishedMedia;
            default: return refPath;
        }
    }

    public executeDeleteContentFlow = async (id: string): Promise<[T, any]> => {
        //find page
        const currentContent = await this.getModelById(id);
        //soft delete page
        //soft delete published page
        //soft delete page's children
        //update the 'HasChildren' field of page's parent
        const result: [T, T, any] = await Promise.all([
            this.softDeleteContent(currentContent),
            this.softDeletePublishedContent(currentContent),
            this.softDeleteContentChildren(currentContent)
        ]);

        console.log(result[2]);
        return [result[0], result[2]];
    }

    private softDeleteContent = (currentContent: T): Promise<T> => {
        currentContent.deleted = new Date();
        //TODO: currentContent.deletedBy = userId
        currentContent.isDeleted = true;
        return currentContent.save();
    }

    private softDeletePublishedContent = async (currentContent: T): Promise<T> => {
        const publishedPage = await this.publishedContentModel.findOne({ _id: currentContent._id }).exec()
        return this.softDeleteContent(publishedPage);
    }

    private softDeleteContentChildren = (currentContent: T): Promise<any> => {
        const startWithParentPathRegExp = new RegExp("^" + `${currentContent.parentPath}${currentContent._id},`);
        const conditions = { parentPath: { $regex: startWithParentPathRegExp } };
        const updateFields: Partial<IContent> = { isDeleted: true, deleted: new Date() };
        return this.contentModel.updateMany(conditions, updateFields).exec()
    }

    private getDescendants = async <K extends T>(mongooseModel: mongoose.Model<K>, parentId: string): Promise<K[]> => {
        //get source content 
        const parentContent = await this.getModelById(parentId);
        if (!parentContent) throw new NotFoundException(parentId);

        const startWithParentPathRegExp = new RegExp("^" + `${parentContent.parentPath}${parentContent._id},`);
        const conditions = { parentPath: { $regex: startWithParentPathRegExp } };
        return mongooseModel.find(conditions).exec();
    }

    public executeCopyContentFlow = async (sourceContentId: string, targetParentId: string): Promise<T> => {

        const copiedContent = await this.createCopiedContent(sourceContentId, targetParentId);
        const copiedResult = await this.createCopiedDescendantsContent(sourceContentId, copiedContent);

        return copiedContent;
    }

    protected createCopiedContent = async (sourceContentId: string, targetParentId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.getModelById(sourceContentId);
        if (!sourceContent) throw new NotFoundException(sourceContentId);

        //create copy content
        const newContent = this.createModelInstance(sourceContent);
        newContent._id = null;
        newContent.isPublished = false;
        newContent.parentId = targetParentId;

        const copiedContent = await this.executeCreateContentFlow(newContent);
        return copiedContent;
    }

    private createCopiedDescendantsContent = async (sourceContentId: string, copiedContent: T): Promise<any> => {
        //get descendants of sourceContent
        const descendants = await this.getDescendants(this.contentModel, sourceContentId);
        if (descendants.length == 0) return {};

        const newDescendants: T[] = [];
        //update parentPath, ancestor
        descendants.forEach(childContent => {
            const newChildContent = this.updateParentPathAndAncestorAndLinkUrl(copiedContent, this.createModelInstance(childContent));
            newChildContent._id = null;
            newDescendants.push(newChildContent);
        })

        const insertOperators = newDescendants.map(x => ({
            insertOne: {
                document: x.toObject()
            }
        }))
        const bulkWriteResult = await this.contentModel.bulkWrite([insertOperators], { ordered: false });
        return bulkWriteResult;
    }

    public executeCutContentFlow = async (sourceContentId: string, targetParentId: string): Promise<T> => {
        const cutContent = await this.createCutContent(sourceContentId, targetParentId);
        const copiedResult = await this.createCutDescendantsContent(sourceContentId, cutContent);

        return cutContent;
    }

    private createCutContent = async (sourceContentId: string, targetParentId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.getModelById(sourceContentId);
        if (!sourceContent) throw new NotFoundException(sourceContentId);

        const targetParent = await this.getModelById(targetParentId);

        this.updateParentPathAndAncestorAndLinkUrl(targetParent, sourceContent);
        const updatedContent = await sourceContent.save();
        return updatedContent;
    }

    private createCutDescendantsContent = async (sourceContentId: string, cutContent: T): Promise<any> => {
        //get descendants of sourceContent
        const descendants = await this.getDescendants<T>(this.contentModel, cutContent._id);
        if (descendants.length == 0) return {};

        descendants.forEach(childContent => {
            const updateChildContent = this.updateParentPathAndAncestorAndLinkUrl(cutContent, childContent);
        })

        const updateOperators = descendants.map(x => ({
            updateOne: {
                filter: { _id: x._id },
                update: x.toObject()
            }
        }));

        const bulkWriteResult = await this.contentModel.bulkWrite([updateOperators], { ordered: false });
        return bulkWriteResult;
    }

    private updateParentPathAndAncestorAndLinkUrl = (newParentContent: T, currentContent: T): T => {
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
        return currentContent;
    }

    protected updateLinkUrl = (newParentContent: T, currentContent: T): T => currentContent;
}