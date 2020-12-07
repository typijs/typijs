import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheService, Cache } from "../../caching";
import { BaseService } from "../shared/base.service";
import { ILanguageBranchDocument, LanguageBranchModel } from './language.model';

@Injectable()
export class LanguageService extends BaseService<ILanguageBranchDocument> {
    private static readonly PrefixCacheKey: string = 'LanguageBranch';
    constructor(private cacheService: CacheService) {
        super(LanguageBranchModel);
    }

    /**
     * Get all enabled languages
     */
    @Cache({ prefixKey: LanguageService.PrefixCacheKey })
    async getEnabledLanguages(): Promise<ILanguageBranchDocument[]> {
        return this.find({ enabled: true }, { lean: true }).sort('sortIndex').exec();
    }

    /**
     * Get enabled language document by language code
     * @param language 
     */
    async getLanguageByCode(language: string): Promise<ILanguageBranchDocument> {
        const languages = await this.getEnabledLanguages();
        return languages.find(x => x.language == language);
    }

    public addLanguage = (doc: Partial<ILanguageBranchDocument>, userId: string): Promise<ILanguageBranchDocument> => {
        this.cacheService.deleteStartWith(LanguageService.PrefixCacheKey);
        doc.createdBy = userId;
        return this.create(doc);
    }

    public updateLanguage = (id: string, doc: Partial<ILanguageBranchDocument>, userId: string): Promise<ILanguageBranchDocument> => {
        this.cacheService.deleteStartWith(LanguageService.PrefixCacheKey);
        doc.updatedBy = userId;
        return this.updateById(id, doc);
    }
}