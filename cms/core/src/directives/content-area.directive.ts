import { Input, Directive, ViewContainerRef, ComponentFactoryResolver, Inject, OnDestroy } from '@angular/core';

import { BLOCK_TYPE_METADATA_KEY } from '../constants/meta-keys';
import { CMS } from './../cms';
import { ContentData } from './../bases/content-data';
import { CmsComponent } from './../bases/cms-component';

@Directive({
    selector: '[cmsContentArea]'
})
export class ContentAreaDirective implements OnDestroy {
    private componentRefs: Array<any> = [];

    private _value: any;
    @Input('cmsContentArea')
    set value(value: any) {
        this._value = value;
        if (this._value) {
            this.createBlockComponent()
        }
    }
    get value(): any {
        return this._value;
    }

    constructor( 
        @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnDestroy() {
        if(this.componentRefs) {
            this.componentRefs.forEach(cmpref=> {
                cmpref.destroy();
            })
            this.componentRefs = [];
        }
    }

    private createBlockComponent() {
        this.viewContainerRef.clear();
        this._value.forEach(element => {
            let contentType = CMS.BLOCK_TYPES[element.contentType];
            let metadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, contentType);

            let blockFactory = this.componentFactoryResolver.resolveComponentFactory(metadata.componentRef);
            let blockComponent = this.viewContainerRef.createComponent(blockFactory);
            (<CmsComponent<ContentData>>blockComponent.instance).currentContent = element.properties;
            this.componentRefs.push(blockComponent);
        });
    }
}