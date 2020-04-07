import * as mongoose from 'mongoose';

import { BaseCtrl } from '../shared/base.controller';
import { ISiteDefinitionDocument, SiteDefinitionModel } from './site-definition.model';

export class SiteDefinitionCtrl extends BaseCtrl<mongoose.Model<ISiteDefinitionDocument>> {
    constructor() { super(SiteDefinitionModel); }

    insertMany = (req, res, next) => {
        //Validate data

        //Delete all records

        //Insert many records
    }
}