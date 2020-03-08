import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, PropertyMetadata } from '@angular-cms/core';
import { ObjectListProperty } from './object-list.property';

@Injectable()
export class ObjectListFactory extends CmsPropertyFactory {
    constructor(componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver, UIHint.ObjectList);
    }

    createCmsPropertyComponent(
        viewContainerRef: ViewContainerRef, 
        formGroup: FormGroup, 
        propertyName: string, 
        propertyMetadata: PropertyMetadata): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(viewContainerRef, formGroup, propertyName, propertyMetadata);

        if (propertyComponent.instance instanceof ObjectListProperty) {
            (<ObjectListProperty>propertyComponent.instance).itemType = propertyMetadata.objectListItemType;
        }

        return propertyComponent;
    }
}