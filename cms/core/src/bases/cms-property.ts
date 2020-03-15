import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { generateUUID } from '../helpers/common';

export abstract class CmsProperty {
    id: string = this.getId();
    @Input() label: string;
    @Input() propertyName: string;
    @Input() formGroup: FormGroup;

    protected getId(id: number | string = generateUUID()): string {
        return this.constructor.name + '_' + id;
    }
}

export abstract class CmsPropertyRender {
    @Input() value: any;
}