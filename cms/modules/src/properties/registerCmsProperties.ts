import { AngularCmsModule, UIHint } from '@angular-cms/core';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { ContentAreaComponent } from './content-area/content-area.component';

export function registerCmsProperties() {
    AngularCmsModule.registerProperties([
        [UIHint.Input, InputComponent],
        [UIHint.Textarea, TextareaComponent],
        [UIHint.PropertyList, PropertyListComponent],
        [UIHint.Xhtml, TinymceComponent],
        [UIHint.Select, DropdownComponent],
        [UIHint.Checkbox, CheckboxComponent],
        [UIHint.ContentArea, ContentAreaComponent]
    ])
}