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

    /**
     * Get primary version of page by id
     * @param id Page Object Id
     * @param language The current language
     * @param host The host name
     */
    public getPrimaryVersionOfPageById = async (id: string, language: string, versionId: string, host: string): Promise<IPageDocument & IPageVersionDocument> => {
        const primaryVersion = await this.getPrimaryVersionOfContentById(id, language, versionId);
        primaryVersion.linkUrl = await this.buildLinkUrl(primaryVersion.parentPath, primaryVersion.urlSegment, language, host);
        return primaryVersion;
    }

    private buildLinkUrl = async (parentPath: string, currentUrlSegment: string, language: string, host: string): Promise<string> => {
        const parentIds = parentPath ? parentPath.split(',').filter(id => id && id.trim() !== '') : [];

        const currentSiteDefinition = await this.siteDefinitionService.getSiteDefinitionByHostname(host);
        const defaultLang = currentSiteDefinition ? currentSiteDefinition.hosts.find(x => x.name == host).language : '';
        const matchStartIndex = currentSiteDefinition ? parentIds.indexOf((currentSiteDefinition.startPage as IPageDocument)._id) : -1;

        let linkUrl = defaultLang == language ? '/' : `/${language}`;
        for (let i = 0; matchStartIndex < i && i < parentIds.length; i++) {
            const urlSegment = await this.getUrlSegmentByPageId(parentIds[i], language);
            linkUrl = `${linkUrl}/${urlSegment}`;
        }
        return `${linkUrl}/${currentUrlSegment}`;
    }

    private getUrlSegmentByPageId = async (id: string, language: string): Promise<string> => {
        const currentContent = await this.contentLanguageService.findOne({ contentId: id, language } as any, { lean: true })
            .select('contentId urlSegment')
            .populate({
                path: 'contentId',
                match: { isDeleted: false },
                select: 'urlSegment'
            })
            .exec();

        return currentContent.urlSegment;
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
        const currentHost = currentSiteDefinition.hosts.find(x => x.name == host);
        // get language from url, fallback to default language of current host
        const defaultLanguage = await this.getLanguageFromUrl(urlObj, currentHost.language);

        if (!defaultLanguage) throw new DocumentNotFoundException(url, 'The language is not found')
        const urlSegments = this.splitPathNameToUrlSegments(pathName, defaultLanguage);
        return await this.resolvePageContentFromUrlSegments(startPage, urlSegments, defaultLanguage);
    }

    private splitPathNameToUrlSegments = (pathname: string, language: string): string[] => {
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

    private recursiveResolvePageByUrlSegment = async (parentPage: IPageDocument, segments: string[], language: string, index: number): Promise<IPageDocument & IPageLanguageDocument> => {
        // get page children
        const childrenPage = (await this.getContentChildren(parentPage._id, language)).filter(x => x.status == VersionStatus.Published);
        if (!childrenPage || childrenPage.length == 0) return null;

        const matchPage = childrenPage.find(page => page.urlSegment == segments[index]);
        if (!matchPage) return null;

        if (index == segments.length - 1) return await this.getPublishedContentById(matchPage._id, language);

        return await this.recursiveResolvePageByUrlSegment(matchPage, segments, language, index + 1);
    }

    /**
     * Extract language code from url
     * @param url 
     * @param defaultLanguage 
     */
    private getLanguageFromUrl = async (url: URL, defaultLanguage: string): Promise<string> => {
        const pathUrl = url.pathname; // --> /abc/xyz
        const paths = pathUrl.split('/');

        if (paths.length > 0) {
            const languageCode = paths[0];
            //TODO should get languages from cache then find one
            const language = await this.languageService.getLanguageByCode(languageCode);
            if (language) return language.language;
        }

        const langDoc = await this.languageService.getLanguageByCode(defaultLanguage);
        return langDoc ? langDoc.language : undefined;
    }

    public getPublishedPageChildren = async (parentId: string, language: string, host: string): Promise<IPageDocument[]> => {
        if (parentId == '0') parentId = null;

        const publishedPages = (await this.getContentChildren(parentId, language)).filter(x => x.status == VersionStatus.Published);
        if (publishedPages.length == 0) return [];

        //TODO: Temporary get first site definition
        publishedPages.forEach(async page => page.linkUrl = await this.buildLinkUrl(page.parentPath, page.urlSegment, language, host));

        return publishedPages;
    }

    public executeCreatePageFlow = async (pageObj: IPageDocument & IPageLanguageDocument, userId: string, language: string): Promise<IPageDocument & IPageVersionDocument> => {
        //get page's parent
        const parentPage = await this.findById(pageObj.parentId).exec();
        //generate url segment
        pageObj.urlSegment = await this.generateUrlSegment(0, slugify(pageObj.name), parentPage ? parentPage._id.toString() : null, language);
        //Step3: create new page
        const savedPage = await this.executeCreateContentFlow(pageObj, userId, language);
        //Step4: update parent page's has children property
        if (savedPage) await this.updateHasChildren(parentPage);
        return savedPage;
    }

    private generateUrlSegment = async (seed: number, originalUrl: string, parentId: string, language: string, generatedNameInUrl?: string): Promise<string> => {

        const urlSegment = generatedNameInUrl ? generatedNameInUrl : originalUrl;
        //Find existing page has the same url segment
        const existPages = await this.contentLanguageService.find({ urlSegment, language }, { lean: true })
            .select('contentId')
            .populate({
                path: 'contentId',
                match: { isDeleted: false },
                select: 'parentId'
            }).exec();

        const count = existPages.map(x => x.contentId as IPageDocument)
            .filter(x => x)
            .filter(x => (!x.parentId && !parentId) || (x.parentId && x.parentId!.toString() == parentId)).length;
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