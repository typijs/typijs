import { Injectable, ComponentRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, ContentTypeProperty, ISelectionFactory, ClassOf } from '@angular-cms/core';
import { SelectProperty } from './select-property';
import { DropdownProperty } from './dropdown/dropdown.property';
import { CheckboxProperty } from './checkbox/checkbox.property';

export abstract class SelectPropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector, propertyUIHint: string, propertyCtor: ClassOf<SelectProperty>) {
        super(injector, propertyUIHint, propertyCtor);
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(property, formGroup);

        if (!property.metadata.selectionFactory) {
            // tslint:disable-next-line: no-console
            console.warn(`The selectionFactory of property ${property.name} is not defined`);
        }
        if (propertyComponent.instance instanceof SelectProperty && property.metadata.selectionFactory) {
            const selectFactory = <ISelectionFactory>(this.injector.get(property.metadata.selectionFactory));
            (<SelectProperty>propertyComponent.instance).selectItems$ = selectFactory.getSelectItems();
        }

        return propertyComponent;
    }
}

@Injectable()
export class DropdownPropertyFactory extends SelectPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Dropdown, DropdownProperty);
    }
}

@Injectable()
export class CheckboxPropertyFactory extends SelectPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Checkbox, CheckboxProperty);
    }
}
