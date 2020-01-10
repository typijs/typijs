import * as mongoose from 'mongoose';

import { SiteDefinition } from './site-definition.model';
import { BaseCtrl } from '../base.controller';
import { ISiteDefinitionModel } from './site-definition.model';

export class SiteDefinitionCtrl extends BaseCtrl<mongoose.Model<ISiteDefinitionModel>> {
    constructor() { super(SiteDefinition); }

    insertMany = (req, res, next) => {
        //Validate data

        //Delete all records

        //Insert many records
    }
}