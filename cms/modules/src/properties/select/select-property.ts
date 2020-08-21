import { Input } from '@angular/core';
import { CmsProperty, SelectItem } from '@angular-cms/core';

export class SelectProperty extends CmsProperty {
    @Input() selectItems: SelectItem[];
}
