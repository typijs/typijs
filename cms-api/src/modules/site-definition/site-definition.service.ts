import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheService } from "../../caching";
import { BaseService } from "../shared/base.service";
import { ISiteDefinitionDocument, SiteDefinitionModel } from "./site-definition.model";

@Injectable()
export class SiteDefinitionService extends BaseService<ISiteDefinitionDocument> {
    constructor(private cacheService: CacheService) {
        super(SiteDefinitionModel);
    }

    public getSiteDefinitionBySiteUrl = (siteUrl: string): Promise<ISiteDefinitionDocument> => {
        const cacheKey = `SiteDefinition:getSiteDefinitionBySiteUrl:${siteUrl}`
        return this.cacheService.get(cacheKey, () =>
            this.findOne(siteUrl ? { siteUrl: siteUrl } : {})
                .populate('startPage') //TODO check if page is deleted or not
                .exec()
        )
    }
}