import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { requiredAdminOrEditor } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { AuthGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { requiredParentId } from '../folder/folder.validation';
import { PageController } from './page.controller';
import { requiredUrl } from './page.validation';
import { LanguageGuard } from '../language';

@Injectable()
export class PageRouter {
    constructor(private pageController: PageController, private authGuard: AuthGuard, private langGuard: LanguageGuard) { }

    get router(): Router {
        const page: Router = asyncRouterErrorHandler(Router());

        //get published children of page
        page.get('/published/children/:parentId', validate(requiredParentId), this.langGuard.checkEnabled(), this.pageController.getPublishedPageChildren);
        //get published page by url
        page.get('/published/:url', validate(requiredUrl), this.pageController.getByUrl);
        //get children of page
        page.get('/children/:parentId', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.langGuard.checkEnabled(), this.pageController.getPageChildren);
        //get page details
        page.get('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.pageController.get);
        //move page from parent to another one
        page.post('/cut', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.pageController.cut);
        //copy page from parent to another one
        page.post('/copy', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.pageController.copy);
        //create the page
        page.post('/', this.authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), this.langGuard.checkEnabled(), this.pageController.create);
        //update pate
        page.put('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.pageController.update);
        //publish page
        page.put('/publish/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.pageController.publish);
        //move to trash
        page.put('/trash/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.moveToTrash);
        //delete page
        page.delete('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.delete)
        return page;
    }
}

