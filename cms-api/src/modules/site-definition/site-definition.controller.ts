import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import { SiteDefinition } from './site-definition.model';
import { BaseCtrl } from '../../base.controller';

export default class SiteDefinitionCtrl extends BaseCtrl {
    model = SiteDefinition;
}