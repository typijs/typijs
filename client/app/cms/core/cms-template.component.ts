import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { PageBase } from './base.pagetype';
import { ComponentBase } from './base.component';
import { PAGE_TYPE_METADATA_KEY } from './constants';
import { ContentService } from './services/content.service';
import { InsertPointDirective } from './directives/insert-point.directive';
import { Component, Input, ChangeDetectionStrategy, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import CMS from './index';

@Component({
    selector: 'cms-template',
    template: `
            <div>
                <ng-template insert-point></ng-template>
            </div>
        `
})
export class CmsTemplateComponent {

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;
    private _criterias: string;

    @Input()
    set criterias(criterias: string) {

    }
    get criterias(): string {
        return this._criterias;
    }

    constructor( @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private contentService: ContentService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event.constructor.name === "NavigationEnd") {
                console.log(window.location.pathname);
                let pathUrl = window.location.pathname;
                this.contentService.getContentByUrl(pathUrl).subscribe(res => {
                    console.log(res);
                    if (res) {
                        let contentType = CMS.PAGE_TYPES.find(x => x.name == res.contentType);
                        let metadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, contentType);
        
                        this.loadComponent(res.properties, metadata);
                    }
                })
            }
        });
        
        let pathUrl = window.location.pathname;
        this.contentService.getContentByUrl(pathUrl).subscribe(res => {
            console.log(res);
            if (res) {
                let contentType = CMS.PAGE_TYPES.find(x => x.name == res.contentType);
                let metadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, contentType);

                this.loadComponent(res.properties, metadata);
            }
        })
    }

    ngDoCheck() {
        //console.log(window.location.pathname);
    }

    loadComponent(content, pageMetadata) {
        if (pageMetadata) {
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            let pageFactory = this.componentFactoryResolver.resolveComponentFactory(pageMetadata.componentRef);
            let pageComponent = viewContainerRef.createComponent(pageFactory);
            (<ComponentBase<PageBase>>pageComponent.instance).currentContent = content;
        }
    }

}