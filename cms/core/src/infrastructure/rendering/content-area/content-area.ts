import { Component, Input } from '@angular/core';
import { CmsPropertyRender } from "../property/property-render";

@Component({
    selector: '[contentAreaRender]',
    template: `<ng-container [cmsContentArea]="value"></ng-container>`
})
export class ContentAreaRender extends CmsPropertyRender {

}

@Component({
    selector: '[contentArea]',
    exportAs: 'contentArea',
    template: `<ng-container [cmsContentArea]="value"></ng-container><ng-content></ng-content>`
})
export class ContentArea {
    private _value: Array<any>;

    @Input('contentArea')
    set value(value: Array<any>) {
        this._value = value;
    }
    get value(): Array<any> {
        return this._value;
    }
}