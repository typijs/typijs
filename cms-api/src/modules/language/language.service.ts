import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheService } from "../../caching";
import { BaseService } from "../shared/base.service";
import { ILanguageBranchDocument, LanguageBranchModel } from './language.model';

@Injectable()
export class LanguageService extends BaseService<ILanguageBranchDocument> {
    private readonly PrefixCacheKey: string = 'LanguageBranch';
    constructor(private cacheService: CacheService) {
        super(LanguageBranchModel);
    }

    /**
     * Get all enabled languages
     */
    public getEnabledLanguages = async (): Promise<ILanguageBranchDocument[]> => {
        const cacheKey = `${this.PrefixCacheKey}:getEnabledLanguages`;
        return this.cacheService.get(cacheKey, () => this.find({ enabled: true }, { lean: true }).sort('sortIndex').exec());
    }

    /**
     * Get enabled language document by language code
     * @param language 
     */
    public getLanguageByCode = async (language: string): Promise<ILanguageBranchDocument> => {
        const languages = await this.getEnabledLanguages();
        return languages.find(x => x.language == language);
    }

    public getDefaultLanguage

    public addLanguage = (doc: Partial<ILanguageBranchDocument>, userId: string): Promise<ILanguageBranchDocument> => {
        this.cacheService.deleteStartWith(this.PrefixCacheKey);
        doc.createdBy = userId;
        return this.create(doc);
    }

    public updateLanguage = (id: string, doc: Partial<ILanguageBranchDocument>, userId: string): Promise<ILanguageBranchDocument> => {
        this.cacheService.deleteStartWith(this.PrefixCacheKey);
        doc.updatedBy = userId;
        return this.updateById(id, doc);
    }
}