import { Router } from 'express';
import { asyncRouterHandler } from '../../errorHandling';
import { SiteDefinitionController } from './site-definition.controller';

const sideDefinition: Router = asyncRouterHandler(Router());
const controller = new SiteDefinitionController();

sideDefinition.get('/site-definition', controller.getAll);

sideDefinition.post('/site-definition', controller.insert);

export { sideDefinition };