import { SiteDefinition } from './site-definition.model';
import { BaseCtrl } from '../base.controller';
import { Model, Document } from 'mongoose';

export class SiteDefinitionCtrl extends BaseCtrl {
    model = SiteDefinition;

    insertMany = (req, res, next) => {
        //Validate data

        //Delete all records
        
        //Insert many records
    }
}