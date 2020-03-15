import { Input, Directive, ViewContainerRef, OnDestroy, ComponentRef } from '@angular/core';

import { CmsPropertyRenderFactoryResolver } from '../factories/property-render.factory';
import { PropertyModel } from '../constants/types';

@Directive({
    selector: '[cmsProperty]'
})
export class CmsPropertyDirective implements OnDestroy {
    private componentRefs: Array<ComponentRef<any>> = [];

    private _value: PropertyModel;
    @Input('cmsProperty')
    set value(value: PropertyModel) {
        this._value = value;
        this.renderProperty();
    }
    get value(): PropertyModel {
        return this._value;
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private propertyRenderFactoryResolver: CmsPropertyRenderFactoryResolver, ) { }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
    }

    private renderProperty() {
        const propertyFactory = this.propertyRenderFactoryResolver.resolvePropertyRenderFactory(this.value.property.metadata.displayType)
        if (!propertyFactory) throw new Error(`Can not resolver propertyRender Factory for ${this.value.property.metadata.displayType}`)

        const propertyComponent = propertyFactory.createPropertyComponent(this.value.property, this.value.value);
        this.viewContainerRef.insert(propertyComponent.hostView);
        this.componentRefs.push(propertyComponent);
    }
}