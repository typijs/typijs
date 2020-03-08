import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, UIHint, PropertyMetadata, ISelectionFactory } from '@angular-cms/core';
import { SelectProperty } from './select-property';

@Injectable()
export class SelectPropertyFactory extends CmsPropertyFactory {
    constructor(componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
        super(componentFactoryResolver, UIHint.Dropdown);
    }

    createCmsPropertyComponent(
        viewContainerRef: ViewContainerRef,
        formGroup: FormGroup,
        propertyName: string,
        propertyMetadata: PropertyMetadata): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(viewContainerRef, formGroup, propertyName, propertyMetadata);

        if (propertyComponent.instance instanceof SelectProperty) {
            const selectFactory = <ISelectionFactory>(this.injector.get(propertyMetadata.selectionFactory));
            (<SelectProperty>propertyComponent.instance).selectItems = selectFactory.GetSelections();
        }

        return propertyComponent;
    }
}

@Injectable()
export class DropdownPropertyFactory extends SelectPropertyFactory {
    propertyKey = UIHint.Dropdown;
}

@Injectable()
export class CheckboxPropertyFactory extends SelectPropertyFactory {
    propertyKey = UIHint.Checkbox;
}