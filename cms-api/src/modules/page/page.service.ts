import * as mongoose from 'mongoose';
import { ContentService } from '../content/content.service';

import { IPageDocument, PageModel } from "./models/page.model";
import { IPageVersionDocument, PageVersionModel } from "./models/page-version.model";
import { IPublishedPageDocument, PublishedPageModel } from './models/published-page.model';
import { ISiteDefinitionDocument, SiteDefinitionModel } from '../site-definition/site-definition.model';

export class PageService extends ContentService<IPageDocument, IPageVersionDocument, IPublishedPageDocument> {

    private siteDefinitionModel: mongoose.Model<ISiteDefinitionDocument>
    constructor() {
        super(PageModel, PageVersionModel, PublishedPageModel);
        this.siteDefinitionModel = SiteDefinitionModel;
    }

    public getPublishedPageByUrl = async (encodedUrl: string): Promise<IPublishedPageDocument> => {
        //need to check isPageDeleted = false
        //get domain from url
        //get start page from domain
        //get start page link url
        const url = Buffer.from(encodedUrl, 'base64').toString();
        const urlObj = new URL(url); // --> https://example.org:80/abc/xyz?123
        const originalUrl = urlObj.origin; // --> https://example.org:80
        const pathUrl = urlObj.pathname; // --> /abc/xyz

        const siteDefinition = await this.getSiteDefinitionBySiteUrl(originalUrl);
        const startPageLinkUrl = siteDefinition != null && siteDefinition.startPage != null ? siteDefinition.startPage.linkUrl : '';
        let linkUrl = `${startPageLinkUrl}${pathUrl}`;
        if (linkUrl.endsWith('/')) linkUrl = linkUrl.substring(0, linkUrl.length - 1);

        const publishedPage = await this.getPublishedPageByLinkUrl(linkUrl);
        return publishedPage ? publishedPage : (startPageLinkUrl != '' ? await this.getPublishedPageByLinkUrl(`${pathUrl}`) : null);
    }

    public getPageChildren = (parentId: string): Promise<IPageDocument[]> => {
        if (parentId == '0') parentId = null;

        return this.contentModel.find({ parentId: parentId, isDeleted: false }).exec()
    }

    public getPublishedPageChildren = (parentId: string): Promise<IPublishedPageDocument[]> => {
        if (parentId == '0') parentId = null;

        //Todo: Temporary get first site definition
        return this.getSiteDefinitionBySiteUrl(null)
            .then((site: ISiteDefinitionDocument) => site.startPage.linkUrl)
            .then((startPageLinkUrl: string) => Promise.all([
                Promise.resolve(startPageLinkUrl),
                this.publishedContentModel.find({ parentId: parentId, isDeleted: false }).exec()
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
        return this.getModelById(pageObj.parentId)
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

    private generateUrlSegment = (seed: number, originalUrl: string, parentId: string, generatedNameInUrl?: string): Promise<string> => {
        if (!parentId) parentId = null;

        return this.contentModel.countDocuments({ urlSegment: generatedNameInUrl ? generatedNameInUrl : originalUrl, parentId: parentId }).exec()
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

    private getPublishedPageByLinkUrl = (linkUrl: string): Promise<IPublishedPageDocument> => {
        return this.publishedContentModel.findOne({ linkUrl: linkUrl })
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

    private getSiteDefinitionBySiteUrl = (siteUrl: string): Promise<ISiteDefinitionDocument> => {
        return this.siteDefinitionModel.findOne(siteUrl ? { siteUrl: siteUrl } : {})
            .populate('startPage')
            .exec()
    }
}