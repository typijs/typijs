import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';

import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { authGuard } from '../auth/auth.middleware';
import { SiteDefinitionController } from './site-definition.controller';

@Injectable()
export class SideDefinitionRouter {
    constructor(private siteController: SiteDefinitionController) { }

    get router(): Router {
        const sideDefinition: Router = asyncRouterErrorHandler(Router());

        sideDefinition.get('/getAll', authGuard.checkRoles([Roles.Admin]), this.siteController.getAll);
        sideDefinition.get('/paginate', authGuard.checkRoles([Roles.Admin]), this.siteController.paginate);
        sideDefinition.get('/:id', authGuard.checkRoles([Roles.Admin]), this.siteController.get);
        sideDefinition.post('/', authGuard.checkRoles([Roles.Admin]), this.siteController.create);

        return sideDefinition;
    }
}