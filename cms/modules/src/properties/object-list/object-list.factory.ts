import { Injectable, ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, PropertyMetadata } from '@angular-cms/core';
import { ObjectListProperty } from './object-list.property';

@Injectable()
export class ObjectListFactory extends CmsPropertyFactory {
    constructor(injector: Injector, componentFactoryResolver: ComponentFactoryResolver) {
        super(UIHint.ObjectList, injector, componentFactoryResolver);
    }

    createPropertyComponent(
        propertyName: string,
        propertyMetadata: PropertyMetadata,
        formGroup: FormGroup,
    ): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(propertyName, propertyMetadata, formGroup);

        if (propertyComponent.instance instanceof ObjectListProperty) {
            (<ObjectListProperty>propertyComponent.instance).itemType = propertyMetadata.objectListItemType;
        }

        return propertyComponent;
    }
}