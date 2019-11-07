import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { uniqueId } from '../helpers/common';

export class CmsProperty {
    id: string = this.getId();
    @Input() label: string;
    @Input() propertyName: string;
    @Input() formGroup: FormGroup;

    protected getId(id: number | string = uniqueId()): string {
        return this.constructor.name + '_' + id;
    }
}