import * as mongoose from 'mongoose';
import { ContentService } from '../content/content.service';

import { IPageDocument, PageModel } from "./models/page.model";
import { IPageVersionDocument, PageVersionModel } from "./models/page-version.model";
import { IPublishedPageDocument, PublishedPageModel, IPublishedPage } from './models/published-page.model';
import { ISiteDefinitionDocument, SiteDefinitionModel } from '../site-definition/site-definition.model';
import { NotFoundException } from '../../errorHandling';

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

        const startPage = await this.getStartPageFromHostname(originalUrl);
        const startPageLinkUrl = startPage != null ? startPage.linkUrl : '';
        const linkUrl = `${startPageLinkUrl}${pathUrl}`;

        const publishedPage = await this.getPublishedPageByLinkUrl(linkUrl);
        if (publishedPage) return publishedPage;
        //if the current page is not startpage's child, resolve directly by its url
        if (startPageLinkUrl != '') return await this.getPublishedPageByLinkUrl(`${pathUrl}`);

        return null;
    }

    public getPageChildren = async (parentId: string): Promise<IPageDocument[]> => {
        if (parentId == '0') parentId = null;

        return this.contentModel.find({ parentId: parentId, isDeleted: false }).exec()
    }

    public getPublishedPageChildren = async (parentId: string): Promise<IPublishedPageDocument[]> => {
        if (parentId == '0') parentId = null;

        //TODO: Temporary get first site definition
        const publishedPages = await this.publishedContentModel.find({ parentId: parentId, isDeleted: false }).exec()
        if (publishedPages.length == 0) return [];

        const startPage = await this.getStartPageFromHostname(null);
        const startPageLinkUrl = startPage != null ? startPage.linkUrl : '';
        publishedPages.forEach(page => page.publishedLinkUrl = this.getPublishedLinkUrl(startPageLinkUrl, page));

        return publishedPages;
    }

    public executeCreatePageFlow = async (pageObj: IPageDocument): Promise<IPageDocument> => {
        //get page's parent
        //generate url segment
        //create new page
        //update parent page's has children property
        const parentPage = await this.getModelById(pageObj.parentId);
        const urlSegment = await this.generateUrlSegment(0, pageObj.urlSegment, parentPage ? parentPage._id : null);
        const savedPage = await this.createPage(pageObj, parentPage, urlSegment);

        if (savedPage) await this.updateHasChildren(parentPage);
        return savedPage;
    }

    private generateUrlSegment = async (seed: number, originalUrl: string, parentId: string, generatedNameInUrl?: string): Promise<string> => {
        if (!parentId) parentId = null;

        const count = await this.contentModel.countDocuments({ urlSegment: generatedNameInUrl ? generatedNameInUrl : originalUrl, parentId: parentId }).exec();

        if (count <= 0) return generatedNameInUrl ? generatedNameInUrl : originalUrl;

        return await this.generateUrlSegment(seed + 1, originalUrl, parentId, `${originalUrl}-${seed + 1}`);
    }

    private createPage = async (newPage: IPageDocument, parentPage: IPageDocument, urlSegment: string): Promise<IPageDocument> => {
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

        return await newPage.save();
    }

    private getPublishedPageByLinkUrl = async (linkUrl: string): Promise<IPublishedPageDocument> => {
        //remove '/' in end of link Url
        if (linkUrl.endsWith('/')) linkUrl = linkUrl.substring(0, linkUrl.length - 1);

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

    private getStartPageFromHostname = async (hostname: string): Promise<IPublishedPageDocument> => {
        const siteDefinition = await this.getSiteDefinitionBySiteUrl(hostname);
        return siteDefinition != null ? siteDefinition.startPage : null;
    }

    private getSiteDefinitionBySiteUrl = async (siteUrl: string): Promise<ISiteDefinitionDocument> => {
        return this.siteDefinitionModel.findOne(siteUrl ? { siteUrl: siteUrl } : {})
            .populate('startPage') //TODO check if page is deleted or not
            .exec()
    }

    //Override the `createCopiedContent` method in base class
    protected createCopiedContent = async (sourceContentId: string, targetParentId: string): Promise<IPageDocument> => {
        //get source content 
        const sourceContent = await this.getModelById(sourceContentId);
        if (!sourceContent) throw new NotFoundException(sourceContentId);

        //create copy content
        const newContent = this.createModelInstance(sourceContent);
        newContent._id = null;
        newContent.isPublished = false;
        newContent.parentId = targetParentId;

        const copiedContent = await this.executeCreatePageFlow(newContent);
        return copiedContent;
    }

    protected createCutContent = async (sourceContentId: string, targetParentId: string): Promise<IPageDocument> => {
        //get source content 
        const sourceContent = await this.getModelById(sourceContentId);
        if (!sourceContent) throw new NotFoundException(sourceContentId);

        const targetParent = await this.getModelById(targetParentId);

        sourceContent.urlSegment = await this.generateUrlSegment(0, sourceContent.urlSegment, targetParent ? targetParent._id : null);

        this.updateParentPathAndAncestorAndLinkUrl(targetParent, sourceContent);
        const updatedContent = await sourceContent.save();
        return updatedContent;
    }

    //Override the `updateLinkUrl` method in base class
    protected updateLinkUrl = (newParentContent: IPageDocument, currentContent: IPageDocument): IPageDocument => {
        const parentId = newParentContent ? newParentContent._id : null;
        const index = parentId ? currentContent.ancestors.findIndex(p => p == parentId) : 0;

        //update link url
        const segments = currentContent.linkUrl.split('/').filter(x => x);
        let newLinkUrl = newParentContent.linkUrl;
        for (let j = segments.length - 1, k = 1; k <= currentContent.ancestors.length - index; j-- , k++) {
            newLinkUrl = newLinkUrl == '/' ? `/${segments[j]}` : `${newLinkUrl}/${segments[j]}`;
        }

        currentContent.linkUrl = newLinkUrl;
        return currentContent;
    }
}