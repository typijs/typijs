import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { Cache, CacheService } from '../../caching';
import { DocumentNotFoundException, Exception } from '../../error';
import { isNullOrWhiteSpace } from '../../utils';
import { slugify } from '../../utils/slugify';
import { ContentVersionService } from '../content/content-version.service';
import { ContentService } from '../content/content.service';
import { VersionStatus } from "../content/version-status";
import { LanguageService } from '../language';
import { SiteDefinitionService } from '../site-definition/site-definition.service';
import { IPageLanguageDocument, PageLanguageModel } from './models/page-language.model';
import { IPageVersionDocument, PageVersionModel } from "./models/page-version.model";
import { IPageDocument, PageModel } from "./models/page.model";

export class PageVersionService extends ContentVersionService<IPageVersionDocument> {
    constructor() {
        super(PageVersionModel);
    }
}

@Injectable()
export class PageService extends ContentService<IPageDocument, IPageLanguageDocument, IPageVersionDocument> {
    private static readonly PrefixCacheKey: string = 'Page';
    constructor(private siteDefinitionService: SiteDefinitionService, private languageService: LanguageService, private cacheService: CacheService) {
        super(PageModel, PageLanguageModel, PageVersionModel);
    }

    /**
     * Get page version detail
     * 
     * If the version Id is not provided, the primary version based on language will be used instead
     * @param id (`Required`) The content's id
     * @param versionId (`Required` but null is allowed)  the version id, if value is null, the primary version based on language will be used
     * @param language (`Required`) The language code (ex 'en', 'de'...)
     * @param host (`Required`) The host name
     */
    async getContentVersion(id: string, versionId: string, language: string, host: string): Promise<IPageDocument & IPageVersionDocument> {
        const primaryVersion = await super.getContentVersion(id, versionId, language);
        const siteDefinition = await this.siteDefinitionService.getCurrentSiteDefinition(host);
        const { _id, parentPath, urlSegment } = primaryVersion;
        const linkTuple = await this.buildLinkUrlTuple(_id.toString(), parentPath, urlSegment, language, siteDefinition);
        primaryVersion.linkUrl = linkTuple[1];
        return primaryVersion;
    }

    /**
     * Gets link urls of multi pages
     * @param id 
     * @param language 
     * @param host 
     * @returns page with url
     */
    async getPageUrls(id: string[], language: string, host: string): Promise<Array<IPageDocument & IPageLanguageDocument>> {

        const statuses = [VersionStatus.Published];
        const fieldsSelect = '_id parentPath language urlSegment';
        const resultPages = await this.getContentItems(id, language, statuses, fieldsSelect, false);

        const linkArray: Array<[string, string]> = await this.buildManyLinkTuples(resultPages, language, host);

        resultPages.forEach(page => {
            const linkItem = linkArray.find(x => x[0] == page._id.toString());
            if (linkItem) page.linkUrl = linkItem[1];
        })

        return resultPages;
    }

    private async buildManyLinkTuples(pages: Array<IPageDocument & IPageLanguageDocument>, language: string, host: string): Promise<Array<[string, string]>> {
        const siteDefinition = await this.siteDefinitionService.getCurrentSiteDefinition(host);

        const fetchLinkPromises: Promise<any>[] = pages.map(page => {
            const { _id, parentPath, urlSegment } = page;
            const buildUrlPromise = this.buildLinkUrlTuple(_id.toString(), parentPath, urlSegment, language, siteDefinition);
            return buildUrlPromise;
        })

        return Promise.all(fetchLinkPromises);
    }

    /**
     * Build link url
     * @param currentId 
     * @param parentPath 
     * @param currentUrlSegment 
     * @param language 
     * @param siteDefinition ([startPageId, defaultLang])
     * @returns [contentId, url]
     */
    @Cache({
        prefixKey: PageService.PrefixCacheKey,
        suffixKey: (args) => `${args[0]}:${args[1]}:${args[2]}:${args[3]}:${args[4][0]}:${args[4][1]}`
    })
    private async buildLinkUrlTuple(currentId: string, parentPath: string, currentUrlSegment: string, language: string, siteDefinition: [string, string]): Promise<[string, string]> {

        const parentIds = parentPath ? parentPath.split(',').filter(id => !isNullOrWhiteSpace(id)) : [];

        const [startPageId, defaultLang] = siteDefinition;

        const urlSegments: string[] = [];
        if (defaultLang !== language) { urlSegments.push(language); }

        const matchStartIndex = parentIds.indexOf(startPageId);
        for (let i = matchStartIndex + 1; i < parentIds.length; i++) {
            const urlSegment = await this.getUrlSegmentByPageId(parentIds[i], language);
            urlSegments.push(urlSegment);
        }

        if (currentId != startPageId) { urlSegments.push(currentUrlSegment); }
        return [currentId, `/${urlSegments.filter(segment => !isNullOrWhiteSpace(segment)).join('/')}`];
    }

    @Cache({
        prefixKey: PageService.PrefixCacheKey,
        suffixKey: (args) => `${args[0]}:${args[1]}`
    })
    private async getUrlSegmentByPageId(id: string, language: string): Promise<string> {
        const fieldsSelect = '_id contentId language urlSegment';
        const currentContent = await this.getContent(id, language, null, fieldsSelect)
        return currentContent.urlSegment;
    }

    /**
     * Resolve page data via url
     * @param encodedUrl 
     */
    getPublishedPageByUrl = async (encodedUrl: string): Promise<IPageDocument & IPageLanguageDocument> => {
        //get domain from url
        const url = Buffer.from(encodedUrl, 'base64').toString();
        const urlObj = new URL(url); // --> https://www.example.org:80/abc/xyz?123
        const host = urlObj.host; // --> www.example.org:80
        const pathName = urlObj.pathname; // --> /abc/xyz

        //get site definition from domain
        const [startPageId, defaultLanguage] = await this.siteDefinitionService.getCurrentSiteDefinition(host);
        if (startPageId === '0') throw new DocumentNotFoundException(url, 'The site definition is not found')

        // get language from url, fallback to default language of current host
        const language = await this.getLanguageFromUrl(urlObj, defaultLanguage);

        if (!language) throw new DocumentNotFoundException(url, 'The language is not found')
        const urlSegments = this.splitPathNameToUrlSegments(pathName, language);
        return await this.resolvePageContentFromUrlSegments(startPageId, urlSegments, language);
    }

    private splitPathNameToUrlSegments = (pathname: string, language: string): string[] => {
        if (!pathname) return [];

        const paths = pathname.split('/').filter(id => !isNullOrWhiteSpace(id));
        if (paths.length == 0) return [];

        if (paths[0] == language) paths.splice(0, 1);
        return paths;
    }

    private resolvePageContentFromUrlSegments = async (startPageId: string, segments: string[], language: string): Promise<IPageDocument & IPageLanguageDocument> => {
        if (!segments || segments.length == 0) return await this.getContent(startPageId, language, [VersionStatus.Published]);

        return await this.recursiveResolvePageByUrlSegment(startPageId, segments, language, 0);
    }

    private recursiveResolvePageByUrlSegment = async (parentPageId: string, segments: string[], language: string, index: number): Promise<IPageDocument & IPageLanguageDocument> => {
        // get page children
        const fieldsSelect: string = '_id urlSegment language status';
        const childrenPage = (await super.getContentChildren(parentPageId, language, null, fieldsSelect))
            .filter(x => x.status == VersionStatus.Published);
        if (!childrenPage || childrenPage.length == 0) return null;

        const matchPage = childrenPage.find(page => page.urlSegment == segments[index]);
        if (!matchPage) return null;

        if (index == segments.length - 1) return await this.getContent(matchPage._id.toString(), language, [VersionStatus.Published]);

        return await this.recursiveResolvePageByUrlSegment(matchPage._id.toString(), segments, language, index + 1);
    }

    /**
     * Extract language code from url with fallback language
     * @param url 
     * @param fallbackLanguage 
     */
    private getLanguageFromUrl = async (url: URL, fallbackLanguage: string): Promise<string> => {
        const pathUrl = url.pathname; // --> /abc/xyz
        const paths = pathUrl.split('/').filter(id => !isNullOrWhiteSpace(id));

        if (paths.length > 0) {
            const languageCode = paths[0];
            //TODO should get languages from cache then find one
            const language = await this.languageService.getLanguageByCode(languageCode);
            if (language) return language.language;
        }

        const langDoc = await this.languageService.getLanguageByCode(fallbackLanguage);
        return langDoc ? langDoc.language : undefined;
    }

    /**
     * Gets page children by parent id
     * @param parentId 
     * @param language 
     * @param [host] 
     * @param [fieldSelect] The Mongoose select field syntax (for example: `'_id name created'`)
     * @returns The array of children 
     */
    async getContentChildren(parentId: string, language: string, host?: string, fieldSelect?: string): Promise<Array<IPageDocument & IPageLanguageDocument>> {
        if (parentId == '0') parentId = null;

        const pageChildren = await super.getContentChildren(parentId, language, host, fieldSelect)
        if (pageChildren.length == 0) return [];

        const linkArray: Array<[string, string]> = await this.buildManyLinkTuples(pageChildren, language, host);

        pageChildren.forEach(page => {
            const linkItem = linkArray.find(x => x[0] == page._id.toString());
            if (linkItem) page.linkUrl = linkItem[1];
        })

        return pageChildren;
    }

    public executeCreateContentFlow = async (pageObj: IPageDocument & IPageLanguageDocument, language: string, userId: string): Promise<IPageDocument & IPageVersionDocument> => {
        //get page's parent
        const parentPage = await this.findById(pageObj.parentId).exec();
        //generate url segment
        pageObj.urlSegment = await this.generateUrlSegment(0, slugify(pageObj.name), parentPage ? parentPage._id.toString() : null, language);
        //Step3: create new page
        const savedPage = await super.executeCreateContentFlow(pageObj, language, userId);
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

    public executePublishContentFlow = async (id: string, versionId: string, userId: string, host: string): Promise<IPageDocument & IPageVersionDocument> => {
        await this.throwIfUrlSegmentDuplicated(id, versionId);
        const publishedContent = await super.executePublishContentFlow(id, versionId, userId);
        const siteDefinition = await this.siteDefinitionService.getCurrentSiteDefinition(host);
        const { _id, parentPath, urlSegment, language } = publishedContent;
        const linkTuple = await this.buildLinkUrlTuple(_id.toString(), parentPath, urlSegment, language, siteDefinition);
        publishedContent.linkUrl = linkTuple[1];

        return publishedContent;
    }

    private throwIfUrlSegmentDuplicated = async (pageId: string, versionId: string): Promise<void> => {
        const pageVersion = await this.contentVersionService.getVersionById(versionId);
        const pageContent = pageVersion.contentId as IPageDocument;
        const { language, urlSegment } = pageVersion;

        //Find published page has the same url segment
        const existPages = await this.contentLanguageService.find({ contentId: { $ne: pageId }, urlSegment, language, status: VersionStatus.Published }, { lean: true })
            .select('contentId name')
            .populate({
                path: 'contentId',
                match: { isDeleted: false },
                select: 'parentId'
            }).exec();

        const parentId = pageContent.parentId;
        const duplicatedUrlSegmentPages = existPages.filter(x =>
            JSON.stringify((x.contentId as IPageDocument).parentId) === JSON.stringify(parentId)
        );

        if (duplicatedUrlSegmentPages.length > 0) {
            const pageInfo = JSON.stringify(duplicatedUrlSegmentPages.map(x => ({ id: (x.contentId as IPageDocument)._id, name: x.name })));
            const message = `The url segment ${urlSegment} has been used in pages ${pageInfo}`;
            throw new Exception(httpStatus.BAD_REQUEST, message);
        }
    }
}