import { Component, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import 'reflect-metadata';

import { PAGE_TYPE_METADATA_KEY } from '../constants/meta-keys';
import { ContentService } from './../services/content.service';
import { InsertPointDirective } from './../directives/insert-point.directive';

import { CMS } from './../cms';
import { PageData } from './../bases/page-data';
import { CmsComponent } from './../bases/cms-component';

@Component({
    selector: 'cms-content',
    template: `<ng-template cmsInsertPoint></ng-template>`
})
export class CmsRenderContentComponent implements OnDestroy {

    private pageComponentRef: any;

    @ViewChild(InsertPointDirective, { static: true }) pageEditHost: InsertPointDirective;

    constructor(
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private contentService: ContentService,
        private router: Router) { }

    ngOnInit() {
        // this.router.events.subscribe((event) => {
        //     if (event.constructor.name === "NavigationEnd") {
        //         console.log(window.location.pathname);
        //         this.resolveContentDataByUrl();
        //     }
        // });
        console.log(window.location.pathname);
        this.resolveContentDataByUrl();
    }

    ngOnDestroy() {
        if (this.pageComponentRef) {
            this.pageComponentRef.destroy();
        }
    }

    private resolveContentDataByUrl() {
        let pathUrl = window.location.pathname;
        this.contentService.getContentByUrl(pathUrl).subscribe(res => {
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
            (<CmsComponent<PageData>>this.pageComponentRef.instance).currentContent = content;
        }
    }
}