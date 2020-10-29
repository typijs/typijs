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

    public getAvailableLanguages = async (): Promise<ILanguageBranchDocument[]> => {
        return await this.find({ enabled: true }, { lean: true }).exec();
    }

    public getLanguageByCode = async (language: string): Promise<ILanguageBranchDocument> => {
        return await this.findOne({ language: language, enabled: true }, { lean: true }).exec();
    }

}