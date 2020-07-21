import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { requiredAdminOrEditor } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { requiredParentId } from '../folder/folder.validation';
import { PageController } from './page.controller';
import { requiredUrl } from './page.validation';

@Injectable()
export class PageRouter {
    constructor(private pageController: PageController) { }

    get router(): Router {
        const page: Router = asyncRouterErrorHandler(Router());

        //get published children of page
        page.get('/published/children/:parentId', validate(requiredParentId), this.pageController.getPublishedPageChildren);
        //get published page by url
        page.get('/published/:url', validate(requiredUrl), this.pageController.getByUrl);
        //get children of page
        page.get('/children/:parentId', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.pageController.getPageChildren);
        //get page details
        page.get('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.get);
        //move page from parent to another one
        page.post('/cut', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.pageController.cut);
        //copy page from parent to another one
        page.post('/copy', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.pageController.copy);
        //create the page
        page.post('/', authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), this.pageController.create);
        //update pate
        page.put('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.update);
        //soft delete page
        page.delete('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.delete)
        return page;
    }
}

