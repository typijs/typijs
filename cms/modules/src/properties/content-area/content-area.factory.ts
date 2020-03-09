import { Injectable, ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { CmsPropertyFactory, UIHint, PropertyMetadata } from '@angular-cms/core';
import { ContentAreaProperty } from './content-area.property';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ContentAreaFactory extends CmsPropertyFactory {
    constructor(injector: Injector, componentFactoryResolver: ComponentFactoryResolver) {
        super(UIHint.ContentArea, injector, componentFactoryResolver);
    }

    createPropertyComponent(propertyName: string, propertyMetadata: PropertyMetadata, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(propertyName, propertyMetadata, formGroup);

        if (propertyComponent.instance instanceof ContentAreaProperty) {
            (<ContentAreaProperty>propertyComponent.instance).allowedTypes = propertyMetadata.allowedTypes;
        }

        return propertyComponent;
    }
}