import { Router } from 'express';
import { Roles } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { authGuard } from '../auth/auth.middleware';
import { SiteDefinitionController } from './site-definition.controller';

const sideDefinition: Router = asyncRouterHandler(Router());
const controller = new SiteDefinitionController();

sideDefinition.get('/getAll', authGuard.checkRoles([Roles.Admin]), controller.getAll);
sideDefinition.get('/paginate', authGuard.checkRoles([Roles.Admin]), controller.paginate);
sideDefinition.get('/:id', authGuard.checkRoles([Roles.Admin]), controller.get);
sideDefinition.post('/', authGuard.checkRoles([Roles.Admin]), controller.create);

export { sideDefinition };
