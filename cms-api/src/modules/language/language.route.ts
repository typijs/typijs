import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { AuthGuard } from '../auth/auth.middleware';
import { LanguageController } from './language.controller';

@Injectable()
export class LanguageRouter {
    constructor(private langController: LanguageController, private authGuard: AuthGuard) { }

    get router(): Router {
        const langRouter: Router = asyncRouterErrorHandler(Router());

        langRouter.get('/getAvailableLanguages', this.langController.getAvailableLanguages);
        langRouter.get('/getSystemLanguageCodes', this.authGuard.checkRoles([Roles.Admin]), this.langController.getAllLanguageCodes);

        langRouter.get('/', this.authGuard.checkRoles([Roles.Admin]), this.langController.getAll);
        langRouter.get('/paginate', this.authGuard.checkRoles([Roles.Admin]), this.langController.paginate);
        langRouter.get('/:id', this.authGuard.checkRoles([Roles.Admin]), this.langController.get);
        langRouter.post('/', this.authGuard.checkRoles([Roles.Admin]), this.langController.create);
        langRouter.put('/:id', this.authGuard.checkRoles([Roles.Admin]), this.langController.update);
        return langRouter;
    }
}