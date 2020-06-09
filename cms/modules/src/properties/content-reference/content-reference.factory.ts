import { ComponentRef, Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, ContentTypeProperty, UIHint } from '@angular-cms/core';
import { ContentReferenceProperty } from './content-reference.property';

@Injectable()
export class ContentReferenceFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(UIHint.ContentReference, injector);
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(property, formGroup);

        if (propertyComponent.instance instanceof ContentReferenceProperty) {
            (<ContentReferenceProperty>propertyComponent.instance).allowedTypes = property.metadata.allowedTypes;
        }

        return propertyComponent;
    }
}