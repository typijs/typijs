import { AngularCmsModule, UIHint } from '@angular-cms/core';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { ObjectListProperty } from './object-list/object-list.property';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { ContentAreaProperty } from './content-area/content-area.property';
import { ContentAreaFactory } from './content-area/content-area.factory';
import { ObjectListFactory } from './object-list/object-list.factory';
import { DropdownPropertyFactory, CheckboxPropertyFactory } from './select/select-property.factory';

export function registerCmsProperties() {
    AngularCmsModule.registerProperties([
        [UIHint.Text, InputComponent],
        [UIHint.Textarea, TextareaComponent],
        [UIHint.ObjectList, ObjectListProperty, ObjectListFactory],
        [UIHint.XHtml, TinymceComponent],
        [UIHint.Dropdown, DropdownComponent, DropdownPropertyFactory],
        [UIHint.Checkbox, CheckboxComponent, CheckboxPropertyFactory],
        [UIHint.ContentArea, ContentAreaProperty, ContentAreaFactory]
    ])
}