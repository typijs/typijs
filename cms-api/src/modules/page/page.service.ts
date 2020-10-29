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
import { LanguageService } from '../language';

@Injectable()
export class PageService extends ContentService<IPageDocument, IPageLanguageDocument, IPageVersionDocument> {

    constructor(private siteDefinitionService: SiteDefinitionService, private languageService: LanguageService) {
        super(PageModel, PageLanguageModel, PageVersionModel);
    }

    public getPublishedPageByUrl = async (encodedUrl: string): Promise<IPageDocument & IPageLanguageDocument> => {
        //get domain from url
        const url = Buffer.from(encodedUrl, 'base64').toString();
        const urlObj = new URL(url); // --> https://www.example.org:80/abc/xyz?123
        const host = urlObj.host; // --> www.example.org:80
        const pathName = urlObj.pathname; // --> /abc/xyz

        //get site definition from domain
        const currentSiteDefinition = await this.siteDefinitionService.getSiteDefinitionByHostname(host);
        if (!currentSiteDefinition) return null;
        //get start page, host, lang from site definition
        const startPage = currentSiteDefinition.startPage as IPageDocument;
        const currentHost = currentSiteDefinition.hosts.find(x => x.name = host);
        // get language from url, fallback to default language of current host
        const defaultLanguage = await this.getLanguageFromUrl(urlObj, currentHost.language);

        const urlSegments = this.getUrlSegments(pathName, defaultLanguage);
        return await this.resolvePageContentFromUrlSegments(startPage, urlSegments, defaultLanguage);
    }

    private getUrlSegments = (pathname: string, language: string): string[] => {
        if (!pathname) return [];

        const paths = pathname.split('/');
        if (paths.length == 0) return [];

        if (paths[0] == language) paths.splice(0, 1);
        return paths;
    }

    private resolvePageContentFromUrlSegments = async (startPage: IPageDocument, segments: string[], language: string): Promise<IPageDocument & IPageLanguageDocument> => {
        if (!segments || segments.length == 0) return await this.getPublishedContentById(startPage._id, language);

        return await this.recursiveResolvePageByUrlSegment(startPage, segments, language, 0);
    }

    private recursiveResolvePageByUrlSegment = async (parentPage: IPageDocument, segment: string[], language: string, level: number): Promise<IPageDocument & IPageLanguageDocument> => {
        // get page children
        const childrenPage = (await this.getContentChildren(parentPage._id, language)).filter(x => x.status == VersionStatus.Published);
        if (!childrenPage || childrenPage.length == 0) return null;

        const matchPage = childrenPage.find(page => page.urlSegment == segment[level]);
        if (!matchPage) return null;

        if (level == segment.length - 1) return await this.getPublishedContentById(matchPage._id, language);

        return await this.recursiveResolvePageByUrlSegment(matchPage, segment, language, level + 1);
    }

    private getLanguageFromUrl = async (url: URL, defaultLanguage: string): Promise<string> => {
        const pathUrl = url.pathname; // --> /abc/xyz
        const paths = pathUrl.split('/');

        if (paths.length > 0) {
            const languageCode = paths[0];
            //TODO should get languages from cache then find one
            const language = await this.languageService.getLanguageByCode(languageCode);
            if (language) return languageCode;
        }
        return defaultLanguage;
    }

    public getPublishedPageChildren = async (parentId: string, language: string): Promise<IPageDocument[]> => {
        if (parentId == '0') parentId = null;

        const publishedPages = (await this.getContentChildren(parentId, language)).filter(x => x.status == VersionStatus.Published);
        if (publishedPages.length == 0) return [];

        //TODO: Temporary get first site definition
        publishedPages.forEach(async page => page.linkUrl = await this.getLinkUrlByPageId(page._id));

        return publishedPages
    }

    private getLinkUrlByPageId = async (pageId: string): Promise<string> => {
        return '';
    }

    public executeCreatePageFlow = async (pageObj: IPageDocument & IPageLanguageDocument, userId: string, language: string): Promise<IPageDocument> => {
        //get page's parent
        const parentPage = await this.findById(pageObj.parentId).exec();
        //generate url segment
        pageObj.urlSegment = await this.generateUrlSegment(0, slugify(pageObj.name), parentPage ? parentPage._id : null, language);
        const savedPage = await this.executeCreateContentFlow(pageObj, userId, language);
        //Step4: update parent page's has children property
        if (savedPage) await this.updateHasChildren(parentPage);
        return savedPage;
    }

    private generateUrlSegment = async (seed: number, originalUrl: string, parentId: string, language: string, generatedNameInUrl?: string): Promise<string> => {
        if (!parentId) parentId = null;

        const urlSegment = generatedNameInUrl ? generatedNameInUrl : originalUrl;
        //Find existing page has the same url segment
        const existPages = await this.contentLanguageService.find({ urlSegment, language }, { lean: true })
            .select('contentId')
            .populate({
                path: 'contentId',
                match: { isDeleted: false },
                select: 'parentId'
            }).exec();

        const count = existPages.filter(x => (x.contentId as IPageDocument).parentId == parentId).length;
        if (count <= 0) return generatedNameInUrl ? generatedNameInUrl : originalUrl;

        return await this.generateUrlSegment(seed + 1, originalUrl, parentId, language, `${originalUrl}${seed + 1}`);
    }

    public validateUrlSegment = async (pageId: string, language: string): Promise<boolean> => {
        const pageContent = await this.contentLanguageService.findOne({ contentId: pageId, language }, { lean: true })
            .populate('contentId').exec();

        if (!pageContent) throw new DocumentNotFoundException(pageId);

        const parentId = (pageContent.contentId as IPageDocument).parentId;
        const urlSegment = pageContent.urlSegment;

        //Find published page has the same url segment
        const existPages = await this.contentLanguageService.find({ contentId: { $ne: pageId }, urlSegment, language, status: VersionStatus.Published }, { lean: true })
            .select('contentId')
            .populate({
                path: 'contentId',
                match: { isDeleted: false },
                select: 'parentId'
            }).exec();

        const count = existPages.filter(x => (x.contentId as IPageDocument).parentId == parentId).length;
        return count <= 0;
    }
}