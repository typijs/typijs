import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';

import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { AuthGuard } from '../auth/auth.middleware';
import { SiteDefinitionController } from './site-definition.controller';

@Injectable()
export class SideDefinitionRouter {
    constructor(private siteController: SiteDefinitionController, private authGuard: AuthGuard) { }

    get router(): Router {
        const sideDefinition: Router = asyncRouterErrorHandler(Router());

        sideDefinition.get('/', this.authGuard.checkRoles([Roles.Admin]), this.siteController.getAll);
        sideDefinition.get('/paginate', this.authGuard.checkRoles([Roles.Admin]), this.siteController.paginate);
        sideDefinition.get('/:id', this.authGuard.checkRoles([Roles.Admin]), this.siteController.get);
        sideDefinition.post('/', this.siteController.createSiteDefinition.bind(this.siteController));
        sideDefinition.put('/:id', this.authGuard.checkRoles([Roles.Admin]), this.siteController.update);

        return sideDefinition;
    }
}