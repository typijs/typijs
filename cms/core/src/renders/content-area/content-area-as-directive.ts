import { Input, Component, Injector, ElementRef } from '@angular/core';
import { PropertyDirectiveBase } from '../property-directive.base';

@Component({
    selector: '[cmsContentArea]',
    exportAs: 'contentArea',
    template: `<ng-container [contentArea]="value"></ng-container><ng-content></ng-content>`
})
export class ContentAreaRenderDirective extends PropertyDirectiveBase {

    @Input('cmsContentArea')
    set value(value: Array<any>) {
        this._value = value;
    }
    get value(): Array<any> {
        return this._value;
    }
    private _value: Array<any>;

    constructor(injector: Injector, elementRef: ElementRef) {
        super(injector, elementRef);
    }
}