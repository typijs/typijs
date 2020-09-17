import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { authGuard } from '../auth/auth.middleware';
import { LanguageController } from './language.controller';

@Injectable()
export class LanguageRouter {
    constructor(private langController: LanguageController) { }

    get router(): Router {
        const langRouter: Router = asyncRouterErrorHandler(Router());

        langRouter.get('/getAll', authGuard.checkRoles([Roles.Admin]), this.langController.getAll);

        return langRouter;
    }
}