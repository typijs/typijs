import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { requiredAdminOrEditor } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { AuthGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { requiredParentId } from '../folder/folder.validation';
import { LanguageGuard } from '../language';
import { PageController } from './page.controller';
import { requiredUrl } from './page.validation';


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

        //get page without populate
        page.get('/simple/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.pageController.getSimpleContent);
        //move page from parent to another one
        page.post('/cut', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.pageController.cut);
        //copy page from parent to another one
        page.post('/copy', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.pageController.copy);
        //create the page
        page.post('/', this.authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), this.langGuard.checkEnabled(), this.pageController.create);

        //move to trash
        page.put('/trash/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.moveToTrash);
        //delete page
        page.delete('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.delete)
        return page;
    }

    get versionRouter(): Router {
        const page: Router = asyncRouterErrorHandler(Router());
        //get all versions of content
        page.get('/list/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.getAllVersionsOfContent);
        //get version detail
        page.get('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.pageController.getVersion);
        //update version
        page.put('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.updateVersion);
        //set version is primary
        page.put('/set-primary/:versionId', this.authGuard.checkRoles(requiredAdminOrEditor), this.pageController.setVersionIsPrimary);
        //publish version
        page.put('/publish/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.publishVersion);
        //delete version
        page.delete('/:versionId', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.pageController.delete)
        return page;
    }
}

