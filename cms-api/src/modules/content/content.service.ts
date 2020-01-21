import * as mongoose from 'mongoose';
import { IContentDocument, RefContent, IContentHasChildItems, IContentVersionDocument, IPublishedContentDocument, IContentVersion, IPublishedContent } from './content.model';
import { cmsPage } from '../page/models/page.model';
import { cmsBlock } from '../block/models/block.model';
import { cmsMedia } from '../media/models/media.model';
import { cmsPublishedPage } from '../page/models/published-page.model';
import { cmsPublishedBlock } from '../block/models/published-block.model';
import { BaseService } from '../shared/base.service';

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

    public executeCreateContentFlow = (content: T): Promise<T> => {
        //get page's parent
        //generate url segment
        //create new page
        //update parent page's has children property
        return this.getModelById(content.parentId)
            .then((parentContent: T) => this.createContent(content, parentContent))
    }

    public createContent = (newContent: T, parentContent: T): Promise<T> => {
        newContent.created = new Date();
        //pageObj.createdBy = userId;
        newContent.changed = new Date();
        //pageObj.changedBy = userId;
        newContent.parentId = parentContent ? parentContent._id : null;

        //create linkUrl and parent path ids
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

    public updateHasChildren = (content: IContentDocument): Promise<boolean> => {
        if (!content) return Promise.resolve(false);
        if (content && content.hasChildren) return Promise.resolve(true);

        content.changed = new Date();
        content.hasChildren = true;
        return content.save().then(result => result.hasChildren);
    }

    public updateAndPublishContent = <K extends IContentHasChildItems & T>(id: string, contentObj: K): Promise<T> => {
        return this.getModelById(id)
            .then((currentContent: K) => contentObj.isDirty ?
                this.updateContent<K>(currentContent, contentObj) :
                Promise.resolve(currentContent))
            .then((currentContent: T) => {
                if (contentObj.isPublished && currentContent.changed > currentContent.published) return this.executePublishContentFlow(currentContent);
                return Promise.resolve(currentContent);
            })
    }

    public executePublishContentFlow = (currentContent: T): Promise<P> => {
        return this.publishContent(currentContent)
            .then((publishedContent: T) => Promise.all([
                Promise.resolve(publishedContent),
                this.createPageVersion(publishedContent)
            ]))
            .then(([publishedPage, pageVersion]: [T, V]) => this.createPublishedContent(publishedPage, pageVersion._id));
    }

    private publishContent = (currentContent: T): Promise<T> => {
        currentContent.isPublished = true;
        currentContent.published = new Date();
        //currentContent.publishedBy = userId;
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

    private createPublishedContent = (currentContent: T, contentVersionId: string): Promise<P> => {
        //find the existing published page
        //delete the existing published page
        //create new the published page
        return this.publishedContentModel.findOneAndDelete({ _id: currentContent._id })
            .exec()
            .then(() => {
                const newPublishedPage: IPublishedContent = {
                    ...currentContent.toObject(),
                    contentId: currentContent._id,
                    contentVersionId: contentVersionId
                }

                const publishedPageDocument = new this.publishedContentModel(newPublishedPage);
                return publishedPageDocument.save();
            })
    }

    private updateContent = <K extends IContentHasChildItems & T>(currentContent: K, pageObj: K): Promise<T> => {
        currentContent.changed = new Date();
        //currentContent.changedBy = userId
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
            case cmsMedia: return cmsMedia;
            default: return refPath;
        }
    }

    public executeDeleteContentFlow = (id: string): Promise<T> => {
        //find page
        //soft delete page
        //soft delete published page
        //soft delete page's children
        //update the 'HasChildren' field of page's parent
        const softDeletePublishedContent = (currentContent: T): Promise<T> =>
            this.publishedContentModel.findOne({ _id: currentContent._id }).exec()
                .then((publishedPage: P) => this.softDeleteContent(publishedPage));

        const softDeleteContentChildren = (currentContent: T): Promise<any> =>
            this.contentModel.updateMany({ parentPath: new RegExp("^" + `${currentContent.parentPath}${currentContent._id},`) }, { isDeleted: true, deleted: new Date() }).exec()

        return this.getModelById(id)
            .then((currentContent: T) => this.softDeleteContent(currentContent))
            .then((currentContent: T) => Promise.all([
                softDeletePublishedContent(currentContent),
                softDeleteContentChildren(currentContent)
            ]))
            .then(([currentContent, result]: [T, any]) => {
                console.log(result);
                return Promise.resolve(currentContent);
            })
    }

    private softDeleteContent = (currentContent: T): Promise<T> => {
        currentContent.deleted = new Date();
        //currentContent.deletedBy = userId
        currentContent.isDeleted = true;
        return currentContent.save();
    }
}