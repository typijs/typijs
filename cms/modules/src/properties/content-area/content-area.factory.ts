import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { CmsPropertyFactory, UIHint, PropertyMetadata } from '@angular-cms/core';
import { ContentAreaProperty } from './content-area.property';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ContentAreaFactory extends CmsPropertyFactory {
    constructor(componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver, UIHint.ContentArea);
    }

    createCmsPropertyComponent(viewContainerRef: ViewContainerRef, formGroup: FormGroup, propertyName: string, propertyMetadata: PropertyMetadata): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(viewContainerRef, formGroup, propertyName, propertyMetadata);

        if (propertyComponent.instance instanceof ContentAreaProperty) {
            (<ContentAreaProperty>propertyComponent.instance).allowedTypes = propertyMetadata.allowedTypes;
        }

        return propertyComponent;
    }
}