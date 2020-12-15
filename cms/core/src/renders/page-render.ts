import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import 'reflect-metadata';
import { BrowserLocationService } from '../browser/browser-location.service';
import { ngEditMode, ngId } from '../constants';
import { Page } from '../services/content/models/page.model';
import { PageService } from '../services/content/page.service';
import { CmsContentRenderFactoryResolver } from './content-render.factory';
import { InsertPointDirective } from './insert-point.directive';


@Component({
    selector: 'cms-page',
    template: `<ng-template cmsInsertPoint></ng-template>`
})
export class CmsPageRender implements OnInit, OnDestroy {

    private pageComponentRef: ComponentRef<any>;
    @ViewChild(InsertPointDirective, { static: true, read: ViewContainerRef }) pageContainerRef: ViewContainerRef;

    constructor(
        private cmsContentRenderFactoryResolver: CmsContentRenderFactoryResolver,
        private locationService: BrowserLocationService,
        private pageService: PageService) { }

    ngOnInit() {
        // Step 1: Check Is Authenticated
        // Step 2: Check user is Editor
        // Step 3: Check if has 'ngeditmode=True' and 'ngid=xxxx'
        // Step 4: Get data by those params
        // Step 5: Else get data by url
        const host = this.locationService.getLocation().host;
        const params = this.locationService.getURLSearchParams();
        if (params.get(ngEditMode) && params.get(ngId)) {
            this.resolveContentDataById(params.get(ngId), params.get('versionId'), params.get('language'), host);
        } else {
            this.resolveContentDataByUrl();
        }
    }

    ngOnDestroy() {
        if (this.pageComponentRef) {
            this.pageComponentRef.destroy();
        }
    }

    private resolveContentDataById(id: string, versionId: string, language: string, host: string) {
        this.pageService.getContentVersion(id, versionId, language, host).subscribe((currentPage: Page) => {
            if (currentPage) {
                this.pageComponentRef = this.createPageComponent(currentPage);
            }
        });
    }

    private resolveContentDataByUrl() {
        const location = this.locationService.getLocation();
        const currentUrl = `${location.origin}${location.pathname}`;
        this.pageService.getPublishedPage(currentUrl).subscribe((currentPage: Page) => {
            if (currentPage) {
                this.pageComponentRef = this.createPageComponent(currentPage);
            }
        });
    }

    private createPageComponent(page: Page): ComponentRef<any> {
        this.pageContainerRef.clear();
        const pageRenderFactory = this.cmsContentRenderFactoryResolver.resolveContentRenderFactory('page');
        return pageRenderFactory.createContentComponent(page, this.pageContainerRef);
    }
}
