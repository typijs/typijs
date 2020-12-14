import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { ContentTypeProperty } from '../../types/content-type';

import { CmsComponent } from '../../bases/cms-component';
import { ContentTypeService } from '../../services/content-type.service';
import { Block } from '../../services/content/models/block.model';
import { BlockData, ContentData } from '../../services/content/models/content-data';
import { CmsPropertyRenderFactoryResolver } from '../property-render.factory';

@Directive({
    selector: '[contentArea]'
})
export class ContentAreaDirective implements OnDestroy {
    private componentRefs: ComponentRef<any>[] = [];

    private _value: any[];
    @Input('contentArea')
    get value(): any[] {
        return this._value;
    }
    set value(value: any[]) {
        this.viewContainerRef.clear();
        this._value = value;
        if (this._value) {
            this._value.forEach(block => {
                // TODO: need to generic to allow display the image, block, (page may be)
                const createdComponent = this.createBlockComponent(block);
                if (createdComponent) { this.componentRefs.push(createdComponent); }
            });
        }
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private contentTypeService: ContentTypeService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private propertyRenderFactoryResolver: CmsPropertyRenderFactoryResolver) { }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
    }

    private createBlockComponent(block: Block): ComponentRef<any> {
        const blockContentType = this.contentTypeService.getBlockType(block.contentType);
        const blockFactory = this.componentFactoryResolver.resolveComponentFactory(blockContentType.metadata.componentRef);
        const blockComponent = this.viewContainerRef.createComponent(blockFactory);

        blockContentType.properties.forEach(property => this.populateReferenceProperty(block, property));

        (<CmsComponent<ContentData>>blockComponent.instance).currentContent = new BlockData(block);
        return blockComponent;
    }

    private populateReferenceProperty(block: Block, property: ContentTypeProperty): void {
        if (!block.properties) { return; }

        const fieldType = property.metadata.displayType;
        const propertyFactory = this.propertyRenderFactoryResolver.resolvePropertyRenderFactory(fieldType);
        block.properties[property.name] = propertyFactory.getPopulatedReferenceProperty(block, property);
    }
}
