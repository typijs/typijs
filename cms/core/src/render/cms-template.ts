import { Component, Input, ChangeDetectionStrategy, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

import { PAGE_TYPE_METADATA_KEY } from './../constants';
import { ContentService } from './../services/content.service';
import { InsertPointDirective } from './../directives/insert-point.directive';

import { CMS } from './../index';
import { PageData } from './../bases/page-data';
import { BaseComponent } from './../bases/base-component';

@Component({
    selector: 'cms-template',
    template: `<ng-template insert-point></ng-template>`
})
export class CmsTemplateComponent {

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;

    constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private contentService: ContentService,
        private route: ActivatedRoute,
        private router: Router) { 
            console.log("abc")
        }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event.constructor.name === "NavigationEnd") {
                console.log(window.location.pathname);
                this.resolveContentDataByUrl();
            }
        });

        this.resolveContentDataByUrl();
    }

    private resolveContentDataByUrl() {
        let pathUrl = window.location.pathname;
        this.contentService.getContentByUrl(pathUrl).subscribe(res => {
            console.log(res);
            if (res) {
                let contentType = CMS.PAGE_TYPES[res.contentType];
                let metadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, contentType);

                this.loadPageComponent(res.properties, metadata);
            }
        })
    }

    private loadPageComponent(content, pageMetadata) {
        if (pageMetadata) {
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            let pageFactory = this.componentFactoryResolver.resolveComponentFactory(pageMetadata.componentRef);
            let pageComponent = viewContainerRef.createComponent(pageFactory);
            (<BaseComponent<PageData>>pageComponent.instance).currentContent = content;
        }
    }

}