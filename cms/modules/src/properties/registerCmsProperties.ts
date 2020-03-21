import { AngularCms, UIHint } from '@angular-cms/core';

import { TextProperty } from './text/text.property';
import { TextareaProperty } from './textarea/textarea.property';
import { ObjectListProperty } from './object-list/object-list.property';
import { XHtmlProperty } from './xhtml/xhtml.property';
import { DropdownProperty } from './select/dropdown/dropdown.property';
import { CheckboxProperty } from './select/checkbox/checkbox.property';
import { ContentAreaProperty } from './content-area/content-area.property';
import { ContentAreaFactory } from './content-area/content-area.factory';
import { ObjectListFactory } from './object-list/object-list.factory';
import { DropdownPropertyFactory, CheckboxPropertyFactory } from './select/select-property.factory';
import { ContentReferenceProperty } from './content-reference/content-reference.property';

export function registerCmsProperties() {
    AngularCms.registerProperties([
        [UIHint.Text, TextProperty],
        [UIHint.Textarea, TextareaProperty],
        [UIHint.ObjectList, ObjectListProperty, ObjectListFactory],
        [UIHint.XHtml, XHtmlProperty],
        [UIHint.Dropdown, DropdownProperty, DropdownPropertyFactory],
        [UIHint.Checkbox, CheckboxProperty, CheckboxPropertyFactory],
        [UIHint.ContentArea, ContentAreaProperty, ContentAreaFactory],
        [UIHint.ContentReference, ContentReferenceProperty]
    ])
}