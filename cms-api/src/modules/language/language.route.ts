import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { AuthGuard } from '../auth';
import { LanguageController } from './language.controller';

@Injectable()
export class LanguageRouter {
    constructor(private langController: LanguageController, private authGuard: AuthGuard) { }

    get router(): Router {
        const langRouter: Router = asyncRouterErrorHandler(Router());

        langRouter.get('/getAvailableLanguages', this.langController.getEnabledLanguages.bind(this.langController));
        langRouter.get('/getSystemLanguageCodes', this.langController.getAllLanguageCodes.bind(this.langController));

        langRouter.get('/', this.authGuard.checkRoles([Roles.Admin]), this.langController.getAll.bind(this.langController));
        langRouter.get('/paginate', this.authGuard.checkRoles([Roles.Admin]), this.langController.paginate.bind(this.langController));
        langRouter.get('/:id', this.authGuard.checkRoles([Roles.Admin]), this.langController.get.bind(this.langController));
        langRouter.post('/', this.langController.addLanguage.bind(this.langController));
        langRouter.put('/:id', this.langController.updateLanguage.bind(this.langController));
        return langRouter;
    }
}