import { Router } from 'express';
import { SiteDefinitionCtrl } from './site-definition.controller';

const sideDefinition: Router = Router();
const controller = new SiteDefinitionCtrl();

sideDefinition.get('/', controller.getAll);

sideDefinition.post('/', controller.insert);

export { sideDefinition };