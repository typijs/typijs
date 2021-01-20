import { Injectable, ComponentRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, ContentTypeProperty, ClassOf } from '@angular-cms/core';
import { ObjectListProperty } from './object-list.property';

@Injectable()
export class ObjectListFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ObjectList, ObjectListProperty);
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(property, formGroup);

        if (propertyComponent.instance instanceof ObjectListProperty) {
            if (property.metadata.objectListItemType) {
                (<ObjectListProperty>propertyComponent.instance).itemType = property.metadata.objectListItemType;
            }
            else {
                throw new Error(`The property '${property.name}' with 'UIHint.ObjectList' must define the 'objectListItemType' in Property Metadata`)
            }
        }

        return propertyComponent;
    }
}
