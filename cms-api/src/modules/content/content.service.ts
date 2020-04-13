import * as mongoose from 'mongoose';

import { NotFoundException } from '../../errorHandling';
import { cmsBlock } from '../block/models/block.model';
import { cmsPublishedBlock } from '../block/models/published-block.model';
import { cmsMedia } from '../media/models/media.model';
import { cmsPublishedMedia } from '../media/models/published-media.model';
import { cmsPage } from '../page/models/page.model';
import { cmsPublishedPage } from '../page/models/published-page.model';
import { BaseService } from '../shared/base.service';
import {
    IContent,
    IContentDocument,
    IContentVersion,
    IContentVersionDocument,
    IPublishedContent,
    IPublishedContentDocument,
    RefContent
} from './content.model';

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

    public getContentModel = (): mongoose.Model<T> => this.contentModel;

    //return plain json object instead of mongoose document
    public getPopulatedContentById = (id: string): Promise<T> => {
        if (!id) id = null;

        return this.contentModel.findOne({ _id: id })
            .lean()
            .populate({
                path: 'childItems.content',
                match: { isDeleted: false }
            })
            .exec();
    }

    //return plain json object instead of mongoose document
    public getPopulatedPublishedContentById = (id: string): Promise<P> => {
        if (!id) id = null;

        return this.publishedContentModel.findOne({ _id: id })
            .lean()
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
        const parentContent = await this.getDocumentById(content.parentId);
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
        let currentContent = await this.getDocumentById(id);
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
        const currentContent = await this.getDocumentById(id);
        //soft delete page
        //soft delete published page
        //soft delete page's children
        //TODO: update the 'HasChildren' field of page's parent
        const result: [T, T, any] = await Promise.all([
            this.softDeleteContent(currentContent),
            this.softDeletePublishedContent(currentContent),
            this.softDeleteContentChildren(currentContent)
        ]);

        const childCount = await this.countChildrenOfContent(currentContent.parentId);
        if (childCount == 0) await this.contentModel.findOneAndUpdate({ _id: currentContent.parentId }, { hasChildren: false }).exec()

        console.log(result[2]);
        return [result[0], result[2]];
    }

    private countChildrenOfContent = async (parentId: string): Promise<number> => {
        return this.contentModel.countDocuments({ parentId: parentId, isDeleted: false }).exec()
    }

    private softDeleteContent = async (currentContent: T): Promise<T> => {
        if (!currentContent) return null;
        currentContent.deleted = new Date();
        //TODO: currentContent.deletedBy = userId
        currentContent.isDeleted = true;
        return currentContent.save();
    }

    private softDeletePublishedContent = async (currentContent: T): Promise<T> => {
        const publishedPage = await this.publishedContentModel.findOne({ _id: currentContent._id }).exec()
        return await this.softDeleteContent(publishedPage);
    }

    private softDeleteContentChildren = (currentContent: T): Promise<any> => {
        if (!currentContent.parentPath) currentContent.parentPath = ',';

        const startWithParentPathRegExp = new RegExp("^" + `${currentContent.parentPath}${currentContent._id},`);
        const conditions = { parentPath: { $regex: startWithParentPathRegExp } };
        const updateFields: Partial<IContent> = { isDeleted: true, deleted: new Date() };
        return this.contentModel.updateMany(conditions, updateFields).exec()
    }

    private getDescendants = async <K extends T>(mongooseModel: mongoose.Model<K>, parentId: string): Promise<K[]> => {
        //get source content 
        const parentContent = await this.getDocumentById(parentId);
        if (!parentContent) throw new NotFoundException(parentId);
        if (!parentContent.parentPath) parentContent.parentPath = ',';

        const startWithParentPathRegExp = new RegExp("^" + `${parentContent.parentPath}${parentContent._id},`);
        const conditions = { parentPath: { $regex: startWithParentPathRegExp } };
        return mongooseModel.find(conditions).exec();
    }

    public executeCopyContentFlow = async (sourceContentId: string, targetParentId: string): Promise<T> => {
        const copiedContent = await this.createCopiedContent(sourceContentId, targetParentId);
        const copiedResult = await this.createCopiedDescendantsContent(sourceContentId, copiedContent);

        return copiedContent;
    }

    //Can be override in the inherited class
    protected createCopiedContent = async (sourceContentId: string, targetParentId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.getDocumentById(sourceContentId);
        if (!sourceContent) throw new NotFoundException(sourceContentId);

        //create copy content
        const newContent = this.createModelInstance(sourceContent.toObject());
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
        descendants.forEach((childContent: T) => {
            const newChildContent = this.updateParentPathAndAncestorAndLinkUrl(copiedContent, this.createModelInstance(childContent.toObject()));
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
        //update published cut content
        if (cutContent.contentType != null && cutContent.isPublished) {
            const publishedContent = await this.updatePublishedCutContent(cutContent);
        }
        const cutResult = await this.createCutDescendantsContent(sourceContentId, cutContent);
        const publishedCutResult = await this.updatePublishedCutDescendantsContent(cutResult[0]);
        return cutContent;
    }

    protected createCutContent = async (sourceContentId: string, targetParentId: string): Promise<T> => {
        //get source content 
        const sourceContent = await this.getDocumentById(sourceContentId);
        if (!sourceContent) throw new NotFoundException(sourceContentId);

        const targetParent = await this.getDocumentById(targetParentId);

        this.updateParentPathAndAncestorAndLinkUrl(targetParent, sourceContent);
        const updatedContent = await sourceContent.save();
        return updatedContent;
    }

    protected updatePublishedCutContent = async (cutContent: T): Promise<T> => {
        const publishContent = {
            parentId: cutContent.parentId,
            parentPath: cutContent.parentPath,
            ancestors: cutContent.ancestors,
            linkUrl: cutContent["linkUrl"]
        }
        return this.publishedContentModel.findOneAndUpdate({ _id: cutContent._id }, publishContent).exec()
    }

    private createCutDescendantsContent = async (sourceContentId: string, cutContent: T): Promise<[T[], any]> => {
        //get descendants of sourceContent
        const descendants = await this.getDescendants<T>(this.contentModel, cutContent._id);
        if (descendants.length == 0) return [descendants, null];

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
        return [descendants, bulkWriteResult];
    }

    private updatePublishedCutDescendantsContent = async (descendants: T[]): Promise<[T[], any]> => {
        const publishedDescendants = descendants.filter(x => x.isPublished && x.contentType != null);
        if (publishedDescendants.length == 0) return null;

        const updateOperators = publishedDescendants.map(x => ({
            updateOne: {
                filter: { _id: x._id },
                update: {
                    parentId: x.parentId,
                    parentPath: x.parentPath,
                    ancestors: x.ancestors,
                    linkUrl: x["linkUrl"]
                }
            }
        }));

        const bulkWriteResult = await this.publishedContentModel.bulkWrite([updateOperators], { ordered: false });
        return [publishedDescendants, bulkWriteResult];
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
        return currentContent;
    }

    //Can be override in the inherited class
    protected updateLinkUrl = (newParentContent: T, currentContent: T): T => currentContent;
}