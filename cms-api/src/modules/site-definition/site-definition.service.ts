import { BaseService } from "../shared/base.service";
import { ISiteDefinitionDocument, SiteDefinitionModel } from "./site-definition.model";

export class SiteDefinitionService extends BaseService<ISiteDefinitionDocument> {
    constructor() {
        super(SiteDefinitionModel);
    }
}