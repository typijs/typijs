import { Router } from 'express';
import { ReflectiveInjector } from 'injection-js';

import { requiredAdminOrEditor } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { requiredParentId } from '../folder/folder.validation';
import { BaseRouter } from '../shared/base.route';
import { PageController } from './page.controller';
import { requiredUrl } from './page.validation';

export class PageRouter extends BaseRouter {
    constructor(injector: ReflectiveInjector) {
        super(injector);
    }

    protected getRouter(): Router {
        const page: Router = asyncRouterHandler(Router());
        const pageController = <PageController>this.injector.get(PageController);

        //get published children of page
        page.get('/published/children/:parentId', validate(requiredParentId), pageController.getPublishedPageChildren);
        //get published page by url
        page.get('/published/:url', validate(requiredUrl), pageController.getByUrl);
        //get children of page
        page.get('/children/:parentId', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), pageController.getPageChildren);
        //get page details
        page.get('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), pageController.get);
        //move page from parent to another one
        page.post('/cut', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), pageController.cut);
        //copy page from parent to another one
        page.post('/copy', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), pageController.copy);
        //create the page
        page.post('/', authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), pageController.create);
        //update pate
        page.put('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), pageController.update);
        //soft delete page
        page.delete('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), pageController.delete)
        return page;
    }
}

