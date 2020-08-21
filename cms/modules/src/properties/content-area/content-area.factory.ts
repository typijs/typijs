import { ComponentRef, Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, ContentTypeProperty, UIHint } from '@angular-cms/core';
import { ContentAreaProperty } from './content-area.property';

@Injectable()
export class ContentAreaFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ContentArea, ContentAreaProperty);
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(property, formGroup);

        if (propertyComponent.instance instanceof ContentAreaProperty) {
            (<ContentAreaProperty>propertyComponent.instance).allowedTypes = property.metadata.allowedTypes;
        }

        return propertyComponent;
    }
}
