import * as mongoose from 'mongoose';

import { BaseController } from '../shared/base.controller';
import { ISiteDefinitionDocument, SiteDefinitionModel } from './site-definition.model';

export class SiteDefinitionCtrl extends BaseController<mongoose.Model<ISiteDefinitionDocument>> {
    constructor() { super(SiteDefinitionModel); }

    insertMany = (req, res, next) => {
        //Validate data

        //Delete all records

        //Insert many records
    }
}