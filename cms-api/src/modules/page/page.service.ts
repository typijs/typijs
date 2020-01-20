import * as mongoose from 'mongoose';
import { ContentService } from '../content/content.service';

import { IPageDocument, PageModel, cmsPage } from "./models/page.model";
import { IPageVersionDocument, IPageVersion, PageVersionModel } from "./models/page-version.model";
import { IPublishedPageDocument, IPublishedPage, PublishedPageModel, cmsPublishedPage } from './models/published-page.model';
import { ISiteDefinitionModel, SiteDefinition } from '../site-definition/site-definition.model';
import { RefContent } from '../content';
import { cmsBlock } from '../block/models/block.model';
import { cmsMedia } from '../media/media.model';
import { cmsPublishedBlock } from '../block/models/published-block.model';

export class PageService extends ContentService<IPageDocument> {
    private pageModel: mongoose.Model<IPageDocument>;
    private pageVersionModel: mongoose.Model<IPageVersionDocument>;
    private publishedPageModel: mongoose.Model<IPublishedPageDocument>;
    private siteDefinitionModel: mongoose.Model<ISiteDefinitionModel>;

    constructor() {
        super(PageModel);
        this.pageModel = PageModel;
        this.pageVersionModel = PageVersionModel;
        this.publishedPageModel = PublishedPageModel;
        this.siteDefinitionModel = SiteDefinition;
    }

    public getPublishedPageByUrl = (url: string): Promise<IPublishedPageDocument> => {
        //need to check isPageDeleted = false
        //get domain from url
        //get start page from domain
        //get start page link url
        const urlObj = new URL(url); // --> https://example.org:80/abc/xyz?123
        const originalUrl = urlObj.origin; // --> https://example.org:80
        const pathUrl = urlObj.pathname; // --> /abc/xyz

        return this.getSiteDefinitionBySiteUrl(originalUrl)
            .then((site: ISiteDefinitionModel) => site.startPage.linkUrl)
            .then((startPageLinkUrl: string) => this.getPublishedPageByLinkUrl(`${startPageLinkUrl}${pathUrl}`))
            .then((publishedPage: IPublishedPageDocument) => publishedPage ?
                Promise.resolve(publishedPage) :
                this.getPublishedPageByLinkUrl(`${pathUrl}`)
            )
    }

    public getPageChildren = (parentId: string): Promise<IPageDocument[]> => {
        if (parentId == '0') parentId = null;

        return this.pageModel.find({ parentId: parentId, isDeleted: false }).exec()
    }

    public getPublishedPageChildren = (parentId: string): Promise<IPublishedPageDocument[]> => {
        if (parentId == '0') parentId = null;

        //Todo: Temporary get first site definition
        return this.getSiteDefinitionBySiteUrl(null)
            .then((site: ISiteDefinitionModel) => site.startPage.linkUrl)
            .then((startPageLinkUrl: string) => Promise.all([
                Promise.resolve(startPageLinkUrl),
                this.publishedPageModel.find({ parentId: parentId, isDeleted: false }).exec()
            ]))
            .then(([startPageLinkUrl, publishedPages]: [string, IPublishedPageDocument[]]) => {
                publishedPages.forEach(page => page.publishedLinkUrl = this.getPublishedLinkUrl(startPageLinkUrl, page))
                return Promise.resolve(publishedPages);
            })
    }

    public beginCreatePageFlow = (pageObj: IPageDocument): Promise<IPageDocument> => {
        //get page's parent
        //generate url segment
        //create new page
        //update parent page's has children property
        return this.getContentById(pageObj.parentId)
            .then((parentPage: IPageDocument) => Promise.all([
                this.generateUrlSegment(0, pageObj.urlSegment, parentPage ? parentPage._id : null),
                Promise.resolve(parentPage)
            ]))
            .then(([urlSegment, parentPage]: [string, IPageDocument]) => Promise.all([
                this.createPage(pageObj, parentPage, urlSegment),
                Promise.resolve(parentPage)
            ]))
            .then(([item, parentPage]: [IPageDocument, IPageDocument]) => this.updateHasChildren(parentPage).then(() => item))
    }

    public updateAndPublishPage = (id: string, pageObj: IPageDocument): Promise<IPageDocument> => {
        return this.getContentById(id)
            .then((currentPage: IPageDocument) => pageObj.isDirty ?
                this.updatePage(currentPage, pageObj) :
                Promise.resolve(currentPage))
            .then((currentPage: IPageDocument) => {
                if (pageObj.isPublished && currentPage.changed > currentPage.published) return this.beginPublishPageFlow(currentPage);
                return Promise.resolve(currentPage);
            })
    }

    public beginDeletePageFlow = (id: string): Promise<IPageDocument> => {
        //find page
        //soft delete page
        //soft delete published page
        //soft delete page's children
        //update the 'HasChildren' field of page's parent
        const softDeletePublishedPage = (currentPage: IPageDocument): Promise<IPageDocument> =>
            this.publishedPageModel.findOne({ _id: currentPage._id }).exec()
                .then((publishedPage: IPublishedPageDocument) => this.softDeletePage(publishedPage));

        const softDeletePageChildren = (currentPage: IPageDocument): Promise<any> =>
            this.pageModel.updateMany({ parentPath: new RegExp("^" + `${currentPage.parentPath}${currentPage._id},`) }, { isDeleted: true, deleted: new Date() }).exec()

        return this.getContentById(id)
            .then((currentPage: IPageDocument) => this.softDeletePage(currentPage))
            .then((currentPage: IPageDocument) => Promise.all([
                softDeletePublishedPage(currentPage),
                softDeletePageChildren(currentPage)
            ]))
            .then(([currentPage, result]: [IPageDocument, any]) => {
                console.log(result);
                return Promise.resolve(currentPage);
            })
    }

    private beginPublishPageFlow = (currentPage: IPageDocument): Promise<IPageDocument> => {
        return this.publishPage(currentPage)
            .then((publishedPage: IPageDocument) => Promise.all([
                Promise.resolve(publishedPage),
                this.createPageVersion(publishedPage)
            ]))
            .then(([publishedPage, pageVersion]: [IPageDocument, IPageVersionDocument]) => this.createPublishedPage(publishedPage, pageVersion._id));
    }

    private generateUrlSegment = (seed: number, originalUrl: string, parentId: string, generatedNameInUrl?: string): Promise<string> => {
        if (!parentId) parentId = null;

        return this.pageModel.countDocuments({ urlSegment: generatedNameInUrl ? generatedNameInUrl : originalUrl, parentId: parentId }).exec()
            .then(count => {
                if (count > 0) {
                    return this.generateUrlSegment(seed + 1, originalUrl, parentId, `${originalUrl}-${seed + 1}`);
                }
                return Promise.resolve(generatedNameInUrl ? generatedNameInUrl : originalUrl);
            })
    }

    private createPage = (newPage: IPageDocument, parentPage: IPageDocument, urlSegment: string): Promise<IPageDocument> => {
        newPage.created = new Date();
        //pageObj.createdBy = userId;
        newPage.changed = new Date();
        //pageObj.changedBy = userId;
        newPage.parentId = parentPage ? parentPage._id : null;
        newPage.urlSegment = urlSegment;

        //create linkUrl and parent path ids
        if (parentPage) {
            newPage.linkUrl = parentPage.linkUrl == '/' ? `/${urlSegment}` : `${parentPage.linkUrl}/${urlSegment}`;
            newPage.parentPath = parentPage.parentPath ? `${parentPage.parentPath}${parentPage._id},` : `,${parentPage._id},`;

            let ancestors = parentPage.ancestors.slice();
            ancestors.push(parentPage._id);
            newPage.ancestors = ancestors
        } else {
            newPage.linkUrl = `/${urlSegment}`;
            newPage.parentPath = null;
            newPage.ancestors = [];
        }

        return newPage.save();
    }

    private updatePage = (currentPage: IPageDocument, pageObj: IPageDocument): Promise<IPageDocument> => {
        currentPage.changed = new Date();
        //currentPage.changedBy = userId
        currentPage.name = pageObj.name;
        currentPage.childItems = pageObj.childItems;
        currentPage.publishedChildItems = this.getPublishedChildItems(pageObj.childItems);
        currentPage.properties = pageObj.properties;
        return currentPage.save();
    }

    private softDeletePage = (currentPage: IPageDocument): Promise<IPageDocument> => {
        currentPage.deleted = new Date();
        //currentPage.deletedBy = userId
        currentPage.isDeleted = true;
        return currentPage.save();
    }

    private getPublishedChildItems = (currentItems: RefContent[]): RefContent[] => {
        return currentItems.map((item: RefContent) => <RefContent>{
            content: item.content,
            refPath: this.getPublishedRefPath(item.refPath)
        })
    };

    private getPublishedRefPath = (refPath: string): string => {
        switch (refPath) {
            case cmsPage: return cmsPublishedPage;
            case cmsBlock: return cmsPublishedBlock;
            case cmsMedia: return cmsMedia;
            default: return refPath;
        }
    }

    private publishPage = (currentPage: IPageDocument): Promise<IPageDocument> => {
        currentPage.isPublished = true;
        currentPage.published = new Date();
        //currentPage.publishedBy = userId;
        return currentPage.save()
    }

    private createPageVersion = (currentPage: IPageDocument): Promise<IPageVersionDocument> => {
        const newPageVersion: IPageVersion = {
            ...currentPage.toObject(),
            pageId: currentPage._id,
            _id: new mongoose.Types.ObjectId()
        }
        const pageVersionDocument = new this.pageVersionModel(newPageVersion);
        return pageVersionDocument.save();
    }

    private createPublishedPage = (currentPage: IPageDocument, pageVersionId: string): Promise<IPublishedPageDocument> => {
        //find the existing published page
        //delete the existing published page
        //create new the published page
        return this.publishedPageModel.findOneAndDelete({ _id: currentPage._id })
            .exec()
            .then(() => {
                const newPublishedPage: IPublishedPage = {
                    ...currentPage.toObject(),
                    pageId: currentPage._id,
                    pageVersionId: pageVersionId
                }

                const publishedPageDocument = new this.publishedPageModel(newPublishedPage);
                return publishedPageDocument.save();
            })
    }

    private getPublishedPageByLinkUrl = (linkUrl: string): Promise<IPublishedPageDocument> => {
        return this.publishedPageModel.findOne({ linkUrl: linkUrl })
            .populate({
                path: 'publishedChildItems.content',
                match: { isDeleted: false }
            })
            .exec()
    }

    private getPublishedLinkUrl = (startPageLinkUrl: string, publishedPage: IPublishedPageDocument): string => {
        const index = publishedPage.linkUrl.indexOf(startPageLinkUrl);
        if (index == 0) return publishedPage.linkUrl.substring(startPageLinkUrl.length);
        return publishedPage.linkUrl;
    }

    private getSiteDefinitionBySiteUrl = (siteUrl: string): Promise<ISiteDefinitionModel> => {
        return this.siteDefinitionModel.findOne(siteUrl ? { siteUrl: siteUrl } : {})
            .populate('startPage')
            .exec()
    }
}