import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { asyncRouterErrorHandler } from '../../error';
import { LanguageGuard } from '../language';
import { PageController } from './page.controller';

@Injectable()
export class PageRouter {
    constructor(private pageController: PageController, private langGuard: LanguageGuard) { }

    get router(): Router {
        const page: Router = asyncRouterErrorHandler(Router());

        //get published page by url
        page.get('/published/:url', this.pageController.getByUrl.bind(this.pageController));
        //get children of page
        page.get('/children/:parentId', this.langGuard.checkEnabled(), this.pageController.getContentChildren.bind(this.pageController));

        //get page without populate
        page.get('/:id', this.langGuard.checkEnabled(), this.pageController.getContent.bind(this.pageController));
        //move page from parent to another one
        page.post('/cut', this.pageController.cut.bind(this.pageController));
        //copy page from parent to another one
        page.post('/copy', this.pageController.copy.bind(this.pageController));
        //create the page
        page.post('/', this.langGuard.checkEnabled(), this.pageController.createContent.bind(this.pageController));

        //move to trash
        page.put('/trash/:id', this.pageController.moveToTrash.bind(this.pageController));
        //delete page
        page.delete('/:id', this.pageController.deleteContent.bind(this.pageController))
        return page;
    }

    get versionRouter(): Router {
        const page: Router = asyncRouterErrorHandler(Router());
        //get all versions of content
        page.get('/list/:id', this.pageController.getAllVersionsOfContent.bind(this.pageController));
        //get version detail
        page.get('/:id', this.langGuard.checkEnabled(), this.pageController.getVersion.bind(this.pageController));
        //update version
        page.put('/:id', this.pageController.updateVersion.bind(this.pageController));
        //set version is primary
        page.put('/set-primary/:versionId', this.pageController.setVersionIsPrimary.bind(this.pageController));
        //publish version
        page.put('/publish/:id', this.pageController.publishVersion.bind(this.pageController));
        //delete version
        page.delete('/:versionId', this.pageController.deleteContent.bind(this.pageController))
        return page;
    }
}

