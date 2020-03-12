import { Injectable, ComponentRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, PropertyMetadata, ISelectionFactory } from '@angular-cms/core';
import { SelectProperty } from './select-property';

@Injectable()
export class SelectPropertyFactory extends CmsPropertyFactory {
    constructor(propertyUIHint: string, injector: Injector) {
        super(propertyUIHint, injector);
    }

    createPropertyComponent(
        propertyName: string,
        propertyMetadata: PropertyMetadata,
        formGroup: FormGroup,
    ): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(propertyName, propertyMetadata, formGroup);

        if (propertyComponent.instance instanceof SelectProperty) {
            const selectFactory = <ISelectionFactory>(this.injector.get(propertyMetadata.selectionFactory));
            (<SelectProperty>propertyComponent.instance).selectItems = selectFactory.GetSelections();
        }

        return propertyComponent;
    }
}

@Injectable()
export class DropdownPropertyFactory extends SelectPropertyFactory {
    constructor(injector: Injector) {
        super(UIHint.Dropdown, injector);
    }
}

@Injectable()
export class CheckboxPropertyFactory extends SelectPropertyFactory {
    constructor(injector: Injector) {
        super(UIHint.Checkbox, injector);
    }
}