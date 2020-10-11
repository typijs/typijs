import 'reflect-metadata';
import { Injectable } from 'injection-js';

import { DocumentNotFoundException } from '../../error';
import { slugify } from '../../utils/slugify';
import { ContentService } from '../content/content.service';
import { SiteDefinitionService } from '../site-definition/site-definition.service';
import { IPageVersionDocument, PageVersionModel } from "./models/page-version.model";
import { IPageDocument, PageModel } from "./models/page.model";
import { IPageLanguageDocument, PageLanguageModel } from './models/page-language.model';
import { VersionStatus } from '../content/content.model';

@Injectable()
export class PageService extends ContentService<IPageDocument, IPageLanguageDocument, IPageVersionDocument> {

    constructor(private siteDefinitionService: SiteDefinitionService) {
        super(PageModel, PageLanguageModel, PageVersionModel);
    }

    public getPopulatedContentById = async (id: string): Promise<IPageDocument> => {
        if (!id) id = null;

        const pageDoc = await this.findById(id, { lean: true })
            .populate({
                path: 'childItems.content',
                match: { isDeleted: false }
            })
            .populate({
                path: 'publishedChildItems.content',
                match: { isDeleted: false }
            })
            .exec();

        const startPageLinkUrl = await this.getStartPageLinkUrl(null);
        pageDoc.publishedLinkUrl = this.getPublishedLinkUrl(startPageLinkUrl, pageDoc)
        return pageDoc;
    }

    public getPublishedPageByUrl = async (encodedUrl: string): Promise<IPublishedPage> => {
        //need to check isPageDeleted = false
        //get domain from url
        //get start page from domain
        //get start page link url
        const url = Buffer.from(encodedUrl, 'base64').toString();
        const urlObj = new URL(url); // --> https://example.org:80/abc/xyz?123
        const originalUrl = urlObj.origin; // --> https://example.org:80
        const pathUrl = urlObj.pathname; // --> /abc/xyz

        const startPageLinkUrl = await this.getStartPageLinkUrl(originalUrl);
        const linkUrl = `${startPageLinkUrl}${pathUrl}`;

        const publishedPage = await this.getPublishedPageByLinkUrl(linkUrl);
        if (publishedPage) return publishedPage;
        //if the current page is not start page's child, resolve directly by its url
        if (startPageLinkUrl != '') return await this.getPublishedPageByLinkUrl(`${pathUrl}`);

        return null;
    }

    public getPublishedPageChildren = async (parentId: string, languageId: string): Promise<IPageDocument[]> => {
        if (parentId == '0') parentId = null;

        //TODO: Temporary get first site definition
        const publishedPages = (await this.getContentChildren(parentId, languageId)).filter(x => x.status == VersionStatus.Published);
        if (publishedPages.length == 0) return [];

        const startPageLinkUrl = await this.getStartPageLinkUrl(null);
        publishedPages.forEach(page => page.publishedLinkUrl = this.getPublishedLinkUrl(startPageLinkUrl, page));

        return publishedPages
    }

    public executeCreatePageFlow = async (pageObj: IPageDocument): Promise<IPageDocument> => {
        const pageDoc = this.createModel(pageObj);
        //get page's parent
        //generate url segment
        //create new page
        //update parent page's has children property
        const parentPage = await this.findById(pageDoc.parentId).exec();
        const urlSegment = await this.generateUrlSegment(0, slugify(pageDoc.name), parentPage ? parentPage._id : null);
        const savedPage = await this.createPage(pageDoc, parentPage, urlSegment);

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
        newPage.createdAt = new Date();
        //pageObj.createdBy = userId;
        newPage.updatedAt = new Date();
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

    private getPublishedPageByLinkUrl = async (linkUrl: string): Promise<IPublishedPage> => {
        //remove '/' in end of link Url
        if (linkUrl.endsWith('/')) linkUrl = linkUrl.substring(0, linkUrl.length - 1);

        return this.contentLanguageModel.findOne({ linkUrl: linkUrl })
            .populate({
                path: 'publishedChildItems.content',
                match: { isDeleted: false }
            })
            .lean()
            .exec()
    }

    private getPublishedLinkUrl = (startPageLinkUrl: string, publishedPage: Partial<IPageDocument>): string => {
        const index = publishedPage.linkUrl.indexOf(startPageLinkUrl);
        if (index == 0) return publishedPage.linkUrl.substring(startPageLinkUrl.length);
        return publishedPage.linkUrl;
    }

    private getStartPageLinkUrl = async (hostname: string): Promise<string> => {
        const startPage = await this.getStartPageFromHostname(null);
        return startPage != null ? startPage.linkUrl : '';
    }

    private getStartPageFromHostname = async (hostname: string): Promise<IPublishedPageDocument> => {
        const siteDefinition = await this.siteDefinitionService.getSiteDefinitionBySiteUrl(hostname);
        return siteDefinition != null ? siteDefinition.startPage : null;
    }

    //Override the `createCopiedContent` method in base class
    protected createCopiedContent = async (sourceContentId: string, targetParentId: string): Promise<IPageDocument> => {
        //get source content 
        const sourceContent = await this.findById(sourceContentId).exec();
        if (!sourceContent) throw new DocumentNotFoundException(sourceContentId);

        //create copy content
        const newContent = this.createModel(sourceContent);
        newContent._id = null;
        newContent.isPublished = false;
        newContent.parentId = targetParentId;

        const copiedContent = await this.executeCreatePageFlow(newContent);
        return copiedContent;
    }

    protected createCutContent = async (sourceContentId: string, targetParentId: string): Promise<IPageDocument> => {
        //get source content 
        const sourceContent = await this.findById(sourceContentId).exec();
        if (!sourceContent) throw new DocumentNotFoundException(sourceContentId);

        const targetParent = await this.findById(targetParentId).exec();

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
        for (let j = segments.length - 1, k = 1; k <= currentContent.ancestors.length - index; j--, k++) {
            newLinkUrl = newLinkUrl == '/' ? `/${segments[j]}` : `${newLinkUrl}/${segments[j]}`;
        }

        currentContent.linkUrl = newLinkUrl;
        return currentContent;
    }
}