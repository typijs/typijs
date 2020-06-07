
import { BaseController } from '../shared/base.controller';
import { SiteDefinitionModel, ISiteDefinitionDocument } from './site-definition.model';
import { BaseService } from '../shared/base.service';

export class SiteDefinitionController extends BaseController<ISiteDefinitionDocument> {
    constructor() {
        super(new BaseService<ISiteDefinitionDocument>(SiteDefinitionModel))
    }
}