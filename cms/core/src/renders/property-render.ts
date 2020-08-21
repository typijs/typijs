import { Input } from '@angular/core';

import { ContentTypeProperty } from '../types/content-type';

export abstract class CmsPropertyRender<T> {
    @Input()
    get value(): T {
        return this._value;
    }
    set value(value: T) {
        this._value = value;
        this.onValueChange(value);
    }
    private _value: T;

    @Input()
    property: ContentTypeProperty;

    // tslint:disable-next-line: no-empty
    protected onValueChange(value: T): void { }
}

