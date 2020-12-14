import 'reflect-metadata';
import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CmsComponent } from '../bases/cms-component';
import { ngEditMode, ngId } from '../constants';
import { ContentTypeMetadata } from '../decorators/content-type.decorator';
import { clone } from '../helpers/common';
import { ContentTypeService } from '../services/content-type.service';
import { PageData } from '../services/content/models/content-data';
import { Page } from '../services/content/models/page.model';
import { PageService } from '../services/content/page.service';
import { ContentTypeProperty } from '../types/content-type';
import { UIHint } from '../types/ui-hint';
import { BrowserLocationService } from '../browser/browser-location.service';
import { InsertPointDirective } from './insert-point.directive';
import { CmsPropertyRenderFactoryResolver } from './property-render.factory';

@Component({
    selector: 'cms-page',
    template: `<ng-template cmsInsertPoint></ng-template>`
})
export class CmsPageRender implements OnInit, OnDestroy {

    private pageComponentRef: ComponentRef<any>;
    @ViewChild(InsertPointDirective, { static: true }) pageEditHost: InsertPointDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private propertyRenderFactoryResolver: CmsPropertyRenderFactoryResolver,
        private contentTypeService: ContentTypeService,
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
                const pageType = this.contentTypeService.getPageType(currentPage.contentType);
                pageType.properties.forEach(property => this.populateReferenceProperty(currentPage, property));
                this.pageComponentRef = this.createPageComponent(currentPage, pageType.metadata);
            }
        });
    }

    private resolveContentDataByUrl() {
        const location = this.locationService.getLocation();
        const currentUrl = `${location.origin}${location.pathname}`;
        this.pageService.getPublishedPage(currentUrl).subscribe((currentPage: Page) => {
            if (currentPage) {
                const pageType = this.contentTypeService.getPageType(currentPage.contentType);
                pageType.properties.forEach(property => this.populateReferenceProperty(currentPage, property));
                this.pageComponentRef = this.createPageComponent(currentPage, pageType.metadata);
            }
        });
    }

    private populateReferenceProperty(currentPage: Page, property: ContentTypeProperty): void {
        if (!currentPage.properties) { return; }

        const fieldType = property.metadata.displayType;
        const propertyFactory = this.propertyRenderFactoryResolver.resolvePropertyRenderFactory(fieldType);
        currentPage.properties[property.name] = propertyFactory.getPopulatedReferenceProperty(currentPage, property);
    }

    private createPageComponent(page: Page, pageMetadata: ContentTypeMetadata): ComponentRef<any> {
        if (pageMetadata) {
            const viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            const pageFactory = this.componentFactoryResolver.resolveComponentFactory(pageMetadata.componentRef);
            const pageComponentRef = viewContainerRef.createComponent(pageFactory);
            (<CmsComponent<PageData>>pageComponentRef.instance).currentContent = new PageData(page);
            return pageComponentRef;
        }
    }
}
