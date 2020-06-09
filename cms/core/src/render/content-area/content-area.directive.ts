import { Input, Directive, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ComponentRef } from '@angular/core';

import { BLOCK_TYPE_METADATA_KEY } from '../../decorators/metadata-key';
import { CMS } from '../../cms';
import { ContentData, BlockData } from '../../bases/content-data';
import { CmsComponent } from '../../bases/cms-component';
import { Block } from '../../models/block.model';

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
            this._value.forEach(block => {
                const createdComponent = this.createBlockComponent(block);
                if (createdComponent) this.componentRefs.push(createdComponent);
            })
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
        if (!contentType) return;
        const metadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, contentType);

        const blockFactory = this.componentFactoryResolver.resolveComponentFactory(metadata.componentRef);
        const blockComponent = this.viewContainerRef.createComponent(blockFactory);

        (<CmsComponent<ContentData>>blockComponent.instance).currentContent = new BlockData(block);
        return blockComponent;
    }
}