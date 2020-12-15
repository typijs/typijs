import { ComponentRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { CmsContentRenderFactoryResolver } from '../content-render.factory';

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
            this._value.forEach(content => {
                const createdComponent = this.createContentComponent(content);
                if (createdComponent) { this.componentRefs.push(createdComponent); }
            });
        }
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private cmsContentRenderFactoryResolver: CmsContentRenderFactoryResolver) { }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
    }

    private createContentComponent(content: any): ComponentRef<any> {
        try {
            const pageRenderFactory = this.cmsContentRenderFactoryResolver.resolveContentRenderFactory(content.type);
            return pageRenderFactory.createContentComponent(content, this.viewContainerRef);
        } catch (err) {
            console.error(err);
        }
    }
}
