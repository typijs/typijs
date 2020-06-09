import { Injectable, ComponentRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, ContentTypeProperty } from '@angular-cms/core';
import { ObjectListProperty } from './object-list.property';

@Injectable()
export class ObjectListFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(UIHint.ObjectList, injector);
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(property, formGroup);

        if (propertyComponent.instance instanceof ObjectListProperty) {
            (<ObjectListProperty>propertyComponent.instance).itemType = property.metadata.objectListItemType;
        }

        return propertyComponent;
    }
}