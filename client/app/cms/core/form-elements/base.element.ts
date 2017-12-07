import { Input } from '@angular/core';
import * as _ from 'lodash';

export class BaseElement {
    id: string = this.getId();
    @Input() label: string;
    @Input() placeholder: string;

    protected getId(id: number | string = _.uniqueId()): string {
        return _.lowerFirst(this.constructor.name) + '_' + id;
    }
}