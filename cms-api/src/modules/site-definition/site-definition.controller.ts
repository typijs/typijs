import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { BaseController } from '../shared/base.controller';
import { ISiteDefinitionDocument } from './site-definition.model';
import { SiteDefinitionService } from './site-definition.service';

@Injectable()
export class SiteDefinitionController extends BaseController<ISiteDefinitionDocument> {
    constructor(siteDefinitionService: SiteDefinitionService) {
        super(siteDefinitionService)
    }
}