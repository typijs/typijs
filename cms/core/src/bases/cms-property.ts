import { Input } from '@angular/core';
import * as _ from 'lodash';
import { FormGroup } from '@angular/forms';

export class CmsProperty {
    id: string = this.getId();
    @Input() label: string;
    @Input() propertyName: string;
    @Input() formGroup: FormGroup;

    protected getId(id: number | string = _.uniqueId()): string {
        return _.lowerFirst(this.constructor.name) + '_' + id;
    }
}