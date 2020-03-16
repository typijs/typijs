import { Input, Directive, ViewContainerRef, OnDestroy, ComponentRef } from '@angular/core';

import { CmsPropertyRenderFactoryResolver } from './property-render.factory';
import { PropertyModel } from '../constants/types';

@Directive({
    selector: '[cmsProperty]'
})
export class CmsPropertyDirective implements OnDestroy {
    private componentRefs: Array<ComponentRef<any>> = [];

    private _model: PropertyModel;
    @Input('cmsProperty')
    set model(value: PropertyModel) {
        this._model = value;
        this.viewContainerRef.clear();
        this.renderProperty();
    }
    get model(): PropertyModel {
        return this._model;
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private propertyRenderFactoryResolver: CmsPropertyRenderFactoryResolver) { }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
        this.viewContainerRef.clear();
    }

    private renderProperty() {
        const propertyFactory = this.propertyRenderFactoryResolver.resolvePropertyRenderFactory(this.model.property.metadata.displayType)
        if (!propertyFactory) throw new Error(`Can not resolver propertyRender Factory for ${this.model.property.metadata.displayType}`)

        const propertyComponent = propertyFactory.createPropertyComponent(this.model.property, this.model.value);
        this.viewContainerRef.insert(propertyComponent.hostView);
        this.componentRefs.push(propertyComponent);
    }
}