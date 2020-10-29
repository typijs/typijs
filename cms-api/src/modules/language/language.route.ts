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

        langRouter.get('/getAvailableLanguages', this.langController.getAvailableLanguages);
        langRouter.get('/getSystemLanguageCodes', authGuard.checkRoles([Roles.Admin]), this.langController.getAllLanguageCodes);

        langRouter.get('/', authGuard.checkRoles([Roles.Admin]), this.langController.getAll);
        langRouter.get('/paginate', authGuard.checkRoles([Roles.Admin]), this.langController.paginate);
        langRouter.get('/:id', authGuard.checkRoles([Roles.Admin]), this.langController.get);
        langRouter.post('/', authGuard.checkRoles([Roles.Admin]), this.langController.create);
        langRouter.put('/:id', authGuard.checkRoles([Roles.Admin]), this.langController.update);
        return langRouter;
    }
}