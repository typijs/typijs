import { Component, Input, ChangeDetectionStrategy, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

import { BLOCK_TYPE_METADATA_KEY } from './../constants';
import { ContentService } from './../services/content.service';
import { InsertPointDirective } from './../directives/insert-point.directive';

import { CMS } from './../index';
import { ContentData } from './../bases/content-data';
import { BaseComponent } from './../bases/base-component';

@Component({
    selector: 'cms-contentarea',
    template: `<ng-template insert-point></ng-template>`
})
export class CmsContentAreaComponent {

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;

    private _value: any;
    @Input()
    set value(value: any) {
        this._value = value;
        if (this._value) {
            this.createBlockComponent()
        }
    }
    get value(): any {
        return this._value;
    }

    constructor( @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private contentService: ContentService,
        private route: ActivatedRoute,
        private router: Router) { }

    private createBlockComponent() {
        let viewContainerRef = this.pageEditHost.viewContainerRef;
        viewContainerRef.clear();
        this._value.forEach(element => {
            let contentType = CMS.BLOCK_TYPES[element.contentType];
            let metadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, contentType);

            let blockFactory = this.componentFactoryResolver.resolveComponentFactory(metadata.componentRef);
            let blockComponent = viewContainerRef.createComponent(blockFactory);
            (<BaseComponent<ContentData>>blockComponent.instance).currentContent = element.properties;
        });
    }

}