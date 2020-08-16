import { Component, Input } from '@angular/core';
import { CmsPropertyRender } from "../property-render";

@Component({
    selector: '[contentAreaProperty]',
    template: `<ng-container [contentArea]="value"></ng-container>`
})
export class ContentAreaPropertyRender extends CmsPropertyRender {}

@Component({
    selector: '[cmsContentArea]',
    exportAs: 'contentArea',
    template: `<ng-container [contentArea]="value"></ng-container><ng-content></ng-content>`
})
export class ContentArea {
    private _value: Array<any>;

    @Input('cmsContentArea')
    set value(value: Array<any>) {
        this._value = value;
    }
    get value(): Array<any> {
        return this._value;
    }
}