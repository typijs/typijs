import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { generateUUID } from '../helpers/common';
import { ContentTypeProperty } from '../types/content-type';

export abstract class CmsProperty {
    @Input() label: string;
    @Input() propertyName: string;
    @Input() formGroup: FormGroup;

    @Input()
    set property(value: ContentTypeProperty) {
        this._property = value;
        this.label = value ? value.metadata.displayName : '';
        this.propertyName = value ? value.name : '';
    }
    get property(): ContentTypeProperty {
        return this._property;
    }
    private _property: ContentTypeProperty;

    id: string = this.getId();

    protected getId(id: number | string = generateUUID()): string {
        return this.constructor.name + '_' + id;
    }
}
