import { Input, Directive, ViewContainerRef, ComponentFactoryResolver, Inject, OnDestroy, ComponentRef } from '@angular/core';

import { BLOCK_TYPE_METADATA_KEY } from '../constants/meta-keys';
import { CMS } from './../cms';
import { ContentData, BlockData } from './../bases/content-data';
import { CmsComponent } from './../bases/cms-component';
import { Block, mapToBlockData } from '../models/block.model';

@Directive({
    selector: '[cmsContentArea]'
})
export class ContentAreaDirective implements OnDestroy {
    private componentRefs: Array<ComponentRef<any>> = [];

    private _value: Array<any>;
    @Input('cmsContentArea')
    set value(value: Array<any>) {
        this.viewContainerRef.clear();
        this._value = value;
        if (this._value) {
            this._value.forEach(block => this.componentRefs.push(this.createBlockComponent(block)))
        }
    }
    get value(): Array<any> {
        return this._value;
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
    }

    private createBlockComponent(block: Block): ComponentRef<any> {
        const contentType = CMS.BLOCK_TYPES[block.contentType];
        const metadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, contentType);

        const blockFactory = this.componentFactoryResolver.resolveComponentFactory(metadata.componentRef);
        const blockComponent = this.viewContainerRef.createComponent(blockFactory);

        (<CmsComponent<ContentData>>blockComponent.instance).currentContent = mapToBlockData(block);
        return blockComponent
    }
}