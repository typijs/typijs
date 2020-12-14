import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheService, Cache } from "../../caching";
import { BaseService } from "../shared/base.service";
import { IHostDefinitionDocument, ISiteDefinitionDocument, SiteDefinitionModel } from "./site-definition.model";
import { DuplicateHostNameException, DuplicateSiteNameException, DuplicateStartPageException, HostNameAlreadyUsedException, MultiplePrimaryHostException } from './site-definition.exception';
import { groupBy } from '../../utils';
import { Validator } from '../../validation/validator';
import { LanguageService } from '../language';
import { IBaseDocument } from '../shared';
import { Logger } from '../../logging';
import { Container } from '../../injector';

@Injectable()
export class SiteDefinitionService extends BaseService<ISiteDefinitionDocument> {

    private static readonly PrefixCacheKey: string = 'SiteDefinition';
    private readonly logger: Logger = Container.get(Logger)

    constructor(private languageService: LanguageService, private cacheService: CacheService) {
        super(SiteDefinitionModel);
    }

    @Cache({
        prefixKey: SiteDefinitionService.PrefixCacheKey,
        suffixKey: (args) => args[0]
    })
    getSiteDefinitionByHostname(hostName: string): Promise<ISiteDefinitionDocument> {
        return this.findOne({ 'hosts.name': hostName }, { lean: true })
            .populate({
                path: 'startPage',
                match: { isDeleted: false }
            })
            .exec()
    }

    /**
     * Get current site definition. Fallback to default value
     * @param host (Optional)
     * @returns Return the Tuple [string, string] type of [startPageId, language]
     */
    getCurrentSiteDefinition = async (host?: string): Promise<[string, string]> => {
        try {
            const currentSite = await this.getDefaultSiteDefinition(host);
            const currentHost = this.getDefaultHostDefinition(currentSite, host);
            const startPageId = (currentSite.startPage as IBaseDocument)._id.toString();
            const defaultLang = currentHost.language;
            return [startPageId, defaultLang];
        } catch (err) {
            this.logger.error('The site definition must be config', err);
            //return default language (first)
            const languages = await this.languageService.getEnabledLanguages();
            const defaultLang = languages.length > 0 ? languages[0].language : '';
            return ['0', defaultLang]
        }
    }

    /**
     * Get site definition by host. If host is not provided, the first site definition will be returned
     * @param host 
     */
    private getDefaultSiteDefinition = async (host?: string): Promise<ISiteDefinitionDocument> => {
        const siteDefinition = host ? await this.getSiteDefinitionByHostname(host) : await this.getFirstSiteDefinition();
        Validator.throwIfDocumentNotFound('SiteDefinition', siteDefinition, { host });
        Validator.throwIfDocumentNotFound('StartPage', siteDefinition.startPage);

        return siteDefinition;
    }

    /**
     * Get host definition by name. If the name is not provided, the primary or first host will be returned
     * @param siteDefinition 
     * @param hostName 
     */
    private getDefaultHostDefinition = (siteDefinition: ISiteDefinitionDocument, hostName?: string): IHostDefinitionDocument => {
        let defaultHost: IHostDefinitionDocument;
        if (hostName) {
            defaultHost = siteDefinition.hosts.find(x => x.name == hostName);
        } else {
            defaultHost = siteDefinition.hosts.find(x => x.isPrimary);
            if (!defaultHost) defaultHost = siteDefinition.hosts.length > 0 ? siteDefinition.hosts[0] : undefined;
        }
        Validator.throwIfDocumentNotFound('Host', defaultHost);
        return defaultHost;
    }

    private getFirstSiteDefinition = (): Promise<ISiteDefinitionDocument> => {
        return this.findOne({}, { lean: true }).sort('createdAt').populate({
            path: 'startPage',
            match: { isDeleted: false }
        }).exec()
    }

    createSiteDefinition = async (siteDefinition: ISiteDefinitionDocument, userId: string): Promise<ISiteDefinitionDocument> => {
        await this.validateSiteDefinition(siteDefinition);

        this.cacheService.deleteStartWith(SiteDefinitionService.PrefixCacheKey);
        siteDefinition.createdBy = userId;
        return this.create(siteDefinition);
    }

    updateSiteDefinition = async (siteDefinition: ISiteDefinitionDocument, userId: string): Promise<ISiteDefinitionDocument> => {
        await this.validateSiteDefinition(siteDefinition);

        this.cacheService.deleteStartWith(SiteDefinitionService.PrefixCacheKey);
        siteDefinition.updatedBy = userId;
        return this.updateById(siteDefinition._id, siteDefinition);
    }

    private validateSiteDefinition = async (siteDefinition: ISiteDefinitionDocument) => {
        const siteId = siteDefinition._id;
        // validation start page and name is unique
        const existQuery = siteId ? {
            $and: [
                { _id: { $ne: siteId } },
                { $or: [{ startPage: siteDefinition.startPage }, { name: siteDefinition.name }] }
            ]
        } : { $or: [{ startPage: siteDefinition.startPage }, { name: siteDefinition.name }] };

        const existedSiteDef = await this.findOne(existQuery as any, { lean: true }).exec();
        if (existedSiteDef) {
            if (existedSiteDef.name == siteDefinition.name) throw new DuplicateSiteNameException(siteDefinition.name);
            if (existedSiteDef.startPage == siteDefinition.startPage) throw new DuplicateStartPageException(siteDefinition.startPage as string);
        }
        // validation start page cannot be nested (should not???)
        // validation host is unique
        const groupByHostNameObj = groupBy(siteDefinition.hosts, 'name');
        Object.keys(groupByHostNameObj).forEach(key => {
            if (groupByHostNameObj[key].length > 1) throw new DuplicateHostNameException(key);
        })
        // validation primary host is unique per language
        const groupByLanguage = groupBy(siteDefinition.hosts, 'language');
        Object.keys(groupByLanguage).forEach(key => {
            if (groupByLanguage[key].filter(x => x.isPrimary).length > 1) throw new MultiplePrimaryHostException(key);
        })
        // validation host is not used yet in other site
        const allQuery = siteId ? { _id: { $ne: siteId } } : {}
        const allSiteDefs = await this.find(allQuery, { lean: true }).exec();
        siteDefinition.hosts.forEach(host => {
            allSiteDefs.forEach(site => {
                if (site.hosts.findIndex(h => h.name == host.name) != -1) throw new HostNameAlreadyUsedException(host.name, site.name);
            })
        })
    }
}