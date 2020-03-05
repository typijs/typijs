import 'reflect-metadata';
import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild } from '@angular/core';

import { PAGE_TYPE_METADATA_KEY, PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY } from '../constants/meta-keys';
import { UIHint } from '../constants/ui-hint';
import { ContentTypeMetadata } from '../decorators/content-type-metadata';
import { PropertyMetadata } from '../decorators/property.decorator';
import { clone } from '../helpers/common';
import { Page } from '../models/page.model';
import { BrowserLocationService } from '../services/browser-location.service';
import { CmsComponent } from './../bases/cms-component';
import { PageData } from './../bases/content-data';
import { CMS } from './../cms';
import { InsertPointDirective } from './../directives/insert-point.directive';
import { PageService } from './../services/page.service';


@Component({
    selector: 'cms-content',
    template: `<ng-template cmsInsertPoint></ng-template>`
})
export class CmsRenderContentComponent implements OnDestroy {

    private pageComponentRef: ComponentRef<any>;
    @ViewChild(InsertPointDirective, { static: true }) pageEditHost: InsertPointDirective;

    constructor(
        private locationService: BrowserLocationService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private pageService: PageService) { }

    ngOnInit() {
        this.resolveContentDataByUrl();
    }

    ngOnDestroy() {
        if (this.pageComponentRef) {
            this.pageComponentRef.destroy();
        }
    }

    private resolveContentDataByUrl() {
        const location = this.locationService.getLocation();
        const currentUrl = `${location.origin}${location.pathname}`;
        this.pageService.getPublishedPage(currentUrl).subscribe((currentPage: Page) => {
            if (currentPage) {
                const contentType = CMS.PAGE_TYPES[currentPage.contentType];
                const pageMetadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, contentType);
                const propertiesMetadata = this.getPropertiesMetadata(contentType);
                propertiesMetadata.forEach(property => this.populateReferenceProperty(currentPage, property));

                this.pageComponentRef = this.createPageComponent(new PageData(currentPage), pageMetadata);
            }
        })
    }

    private getPropertiesMetadata(contentType: string): { name: string, metadata: PropertyMetadata }[] {
        const properties: Array<string> = Reflect.getMetadata(PROPERTIES_METADATA_KEY, contentType);
        return properties.map(propertyName => ({ name: propertyName, metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentType, propertyName) }))
    }

    private populateReferenceProperty(currentPage: Page, property: { name: string, metadata: PropertyMetadata }): void {
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