import { Input, Directive, ViewContainerRef, ComponentFactoryResolver, Inject, OnDestroy, ComponentRef } from '@angular/core';

import { BLOCK_TYPE_METADATA_KEY } from '../decorators/metadata-key';
import { CMS } from './../cms';
import { ContentData, BlockData } from './../bases/content-data';
import { CmsComponent } from './../bases/cms-component';
import { Block } from '../models/block.model';
import { CmsPropertyFactoryResolver } from '../bases/cms-property.factory';

@Directive({
    selector: '[cmsProperty]'
})
export class CmsPropertyDirective implements OnDestroy {
    private componentRefs: Array<ComponentRef<any>> = [];

    private _value: any;
    @Input('cmsProperty')
    set value(value: any) {
        this._value = value;

    }
    get value(): any {
        return this._value;
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private cmsPropertyFactoryResolver: CmsPropertyFactoryResolver) { }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
    }

    private renderProperty() {
        //const propertyFactory = this.cmsPropertyFactoryResolver.resolvePropertyFactory()
    }

}