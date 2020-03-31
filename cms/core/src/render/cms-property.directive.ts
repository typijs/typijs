import { ComponentRef, Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';

import { ngEditMode } from '../constants';
import { PropertyModel } from '../constants/types';
import { BrowserLocationService } from '../services/browser-location.service';
import { CmsPropertyRenderFactoryResolver } from './property-render.factory';


@Directive({
    selector: '[cmsProperty]'
})
export class CmsPropertyDirective implements OnInit, OnDestroy {

    @Input('cmsProperty')
    set model(value: PropertyModel) {
        this._model = value;
        this.viewContainerRef.clear();
        this.renderProperty();
    }
    get model(): PropertyModel {
        return this._model;
    }

    ngEditMode: boolean = false;

    private _model: PropertyModel;
    private componentRefs: Array<ComponentRef<any>> = [];

    private unbindMouseEnterListener: Function;
    private unbindMouseLeaveListener: Function;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private zone: NgZone,
        private viewContainerRef: ViewContainerRef,
        private propertyRenderFactoryResolver: CmsPropertyRenderFactoryResolver,
        private locationService: BrowserLocationService) { }

    ngOnInit() {
        this.ngEditMode = this.getEditModeFlag();
        //TODO: need to check is authenticate and user belong Editor group
        if (this.ngEditMode) {
            this.setDefaultBorderStyle();
            //TODO: The event will work fine when putting the register in zone.runOutsideAngular. Need to find out.
            this.zone.runOutsideAngular(() => {
                this.unbindMouseEnterListener = this.renderer.listen(this.elementRef.nativeElement.parentElement, 'mouseenter', (event) => {
                    this.setHoverBorderStyle();
                });
                this.unbindMouseLeaveListener = this.renderer.listen(this.elementRef.nativeElement.parentElement, 'mouseleave', (event) => {
                    this.setDefaultBorderStyle();
                });
            });
        }
    }

    private getEditModeFlag(): boolean {
        const params = this.locationService.getURLSearchParams();
        return params.get(ngEditMode) == 'True' || params.get(ngEditMode) == 'true'
    }

    private setDefaultBorderStyle() {
        this.renderer.setStyle(this.elementRef.nativeElement.parentElement, 'border', '1px solid #35cbff');
        this.renderer.setStyle(this.elementRef.nativeElement.parentElement, 'box-shadow', '');
    }

    private setHoverBorderStyle() {
        this.renderer.setStyle(this.elementRef.nativeElement.parentElement, 'border', '1px solid #9FC733');
        this.renderer.setStyle(this.elementRef.nativeElement.parentElement, 'box-shadow', '0 0 5px #9FC733');
    }

    private renderProperty() {
        const propertyFactory = this.propertyRenderFactoryResolver.resolvePropertyRenderFactory(this.model.property.metadata.displayType)
        if (!propertyFactory) throw new Error(`Can not resolver propertyRender Factory for ${this.model.property.metadata.displayType}`)

        const propertyComponent = propertyFactory.createPropertyComponent(this.model.property, this.model.value);
        this.viewContainerRef.insert(propertyComponent.hostView);
        this.componentRefs.push(propertyComponent);
    }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
        this.viewContainerRef.clear();
        if (this.unbindMouseEnterListener) this.unbindMouseEnterListener();
        if (this.unbindMouseLeaveListener) this.unbindMouseLeaveListener();
    }
}