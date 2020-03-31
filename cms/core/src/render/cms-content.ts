import 'reflect-metadata';
import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild, OnInit } from '@angular/core';

import { ngEditMode, ngId } from '../constants';
import { UIHint } from '../constants/ui-hint';
import { ContentTypeProperty } from '../constants/types';
import { ContentTypeMetadata } from '../decorators/content-type.decorator';

import { InsertPointDirective } from '../directives/insert-point.directive';

import { clone } from '../helpers/common';
import { Page } from '../models/page.model';
import { CmsComponent } from '../bases/cms-component';
import { PageData } from '../bases/content-data';
import { PageService } from '../services/page.service';
import { BrowserLocationService } from '../services/browser-location.service';
import { ContentTypeService } from '../services/content-type.service';

@Component({
    selector: 'cms-content',
    template: `<ng-template cmsInsertPoint></ng-template>`
})
export class CmsContentRender implements OnInit, OnDestroy {

    private pageComponentRef: ComponentRef<any>;
    @ViewChild(InsertPointDirective, { static: true }) pageEditHost: InsertPointDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private contentTypeService: ContentTypeService,
        private locationService: BrowserLocationService,
        private pageService: PageService) { }

    ngOnInit() {
        // Step 1: Check Is Authenticated
        // Step 2: Check user is Editor
        // Step 3: Check if has 'ngeditmode=True' and 'ngid=xxxx'
        // Step 4: Get data by those params
        // Step 5: Else get data by url
        const params = this.locationService.getURLSearchParams();
        if (params.get(ngEditMode) && params.get(ngId)) {
            this.resolveContentDataById(params.get(ngId));
        } else {
            this.resolveContentDataByUrl();
        }
    }

    ngOnDestroy() {
        if (this.pageComponentRef) {
            this.pageComponentRef.destroy();
        }
    }

    private resolveContentDataById(id: string) {
        this.pageService.getContent(id).subscribe((currentPage: Page) => {
            if (currentPage) {
                const pageType = this.contentTypeService.getPageType(currentPage.contentType);
                pageType.properties.forEach(property => this.populateReferenceProperty(currentPage, property));
                this.pageComponentRef = this.createPageComponent(new PageData(currentPage), pageType.metadata);
            }
        })
    }

    private resolveContentDataByUrl() {
        const location = this.locationService.getLocation();
        const currentUrl = `${location.origin}${location.pathname}`;
        this.pageService.getPublishedPage(currentUrl).subscribe((currentPage: Page) => {
            if (currentPage) {
                const pageType = this.contentTypeService.getPageType(currentPage.contentType);
                pageType.properties.forEach(property => this.populateReferenceProperty(currentPage, property));
                this.pageComponentRef = this.createPageComponent(new PageData(currentPage), pageType.metadata);
            }
        })
    }

    private populateReferenceProperty(currentPage: Page, property: ContentTypeProperty): void {
        if (!currentPage.properties) return;

        const childItems = currentPage.publishedChildItems;
        const fieldType = property.metadata.displayType;
        switch (fieldType) {
            case UIHint.ContentArea:
                const fieldValue = currentPage.properties[property.name]
                if (Array.isArray(fieldValue)) {
                    for (let i = 0; i < fieldValue.length; i++) {
                        const matchItem = childItems.find(x => x.content && x.content._id == fieldValue[i]._id);
                        if (matchItem) {
                            fieldValue[i] = clone(matchItem.content);
                        }
                    }
                    currentPage.properties[property.name] = fieldValue;
                }
                break;
        }
    }

    private createPageComponent(pageData: PageData, pageMetadata: ContentTypeMetadata): ComponentRef<any> {
        if (pageMetadata) {
            const viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            const pageFactory = this.componentFactoryResolver.resolveComponentFactory(pageMetadata.componentRef);
            const pageComponentRef = viewContainerRef.createComponent(pageFactory);
            (<CmsComponent<PageData>>pageComponentRef.instance).currentContent = pageData;
            return pageComponentRef;
        }
    }
}