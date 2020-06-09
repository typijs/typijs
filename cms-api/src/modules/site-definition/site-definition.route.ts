import { Router } from 'express';
import { asyncRouterHandler } from '../../errorHandling';
import { SiteDefinitionController } from './site-definition.controller';

const sideDefinition: Router = asyncRouterHandler(Router());
const controller = new SiteDefinitionController();

sideDefinition.get('/getAll', controller.getAll);
sideDefinition.get('/paginate', controller.paginate);
sideDefinition.get('/:id', controller.get);
sideDefinition.post('/', controller.create);

export { sideDefinition };