import { Input } from '@angular/core';
import { CmsProperty, SelectItem } from '@angular-cms/core';
import { Observable } from 'rxjs';

export class SelectProperty extends CmsProperty {
    @Input() selectItems$: Observable<SelectItem[]>;
}
