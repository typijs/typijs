import { Input, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { generateUUID } from '../helpers/common';
import { ContentTypeProperty } from '../types/content-type';

@Directive()
export abstract class CmsProperty {
    @Input() label: string;
    @Input() propertyName: string;
    @Input() formGroup: FormGroup;

    @Input()
    get property(): ContentTypeProperty {
        return this._property;
    }
    set property(value: ContentTypeProperty) {
        this._property = value;
        this.label = value ? value.metadata.displayName : '';
        this.propertyName = value ? value.name : '';
    }
    private _property: ContentTypeProperty;

    id: string = this.getId();

    protected getId(id: number | string = generateUUID()): string {
        return this.constructor.name + '_' + id;
    }
}
