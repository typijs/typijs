import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { PAGE_TYPE_METADATA_KEY } from './../constants';
import { ContentService } from './../services/content.service';
import { InsertPointDirective } from './../directives/insert-point.directive';

import { CMS } from './../cms';
import { PageData } from './../bases/page-data';
import { BaseComponent } from './../bases/base-component';

@Component({
    selector: 'cms-template',
    template: `<ng-template cmsInsertPoint></ng-template>`
})
export class CmsTemplateComponent implements OnDestroy {

    private pageComponentRef: any;

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;

    constructor(
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private contentService: ContentService,
        private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event.constructor.name === "NavigationEnd") {
                console.log(window.location.pathname);
                this.resolveContentDataByUrl();
            }
        });

        this.resolveContentDataByUrl();
    }

    ngOnDestroy() {
        if(this.pageComponentRef) {
            this.pageComponentRef.destroy();
        }
    }

    private resolveContentDataByUrl() {
        let pathUrl = window.location.pathname;
        this.contentService.getContentByUrl(pathUrl).subscribe(res => {
            console.log(res);
            if (res) {
                let contentType = CMS.PAGE_TYPES[res.contentType];
                let metadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, contentType);

                this.createPageComponent(res.properties, metadata);
            }
        })
    }

    private createPageComponent(content, pageMetadata) {
        if (pageMetadata) {
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            let pageFactory = this.componentFactoryResolver.resolveComponentFactory(pageMetadata.componentRef);
            this.pageComponentRef = viewContainerRef.createComponent(pageFactory);
            (<BaseComponent<PageData>>this.pageComponentRef.instance).currentContent = content;
        }
    }
}