import { Router } from 'express';
import { SiteDefinitionCtrl } from './site-definition.controller';

const sideDefinition: Router = Router();
const controller = new SiteDefinitionCtrl();

sideDefinition.get('/site-definition', controller.getAll);

sideDefinition.post('/site-definition', controller.insert);

export { sideDefinition };