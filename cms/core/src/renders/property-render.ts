import { Component, Input } from '@angular/core';

import { ContentTypeProperty } from '../types/content-type';

export abstract class CmsPropertyRender<T> {
    @Input()
    set value(value: T) {
        this._value = value;
        this.onValueChange(value);
    }
    get value(): T {
        return this._value;
    }
    private _value: T;

    @Input()
    property: ContentTypeProperty;

    protected onValueChange(value: T): void { }
}

