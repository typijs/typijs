import { Input, Component, Injector, ElementRef } from '@angular/core';
import { PropertyDirectiveBase } from '../property-directive.base';

@Component({
    selector: '[cmsContentArea]',
    exportAs: 'contentArea',
    template: `<ng-container [contentArea]="value"></ng-container><ng-content></ng-content>`
})
export class ContentAreaRenderDirective extends PropertyDirectiveBase {

    @Input('cmsContentArea')
    get value(): any[] {
        return this._value;
    }
    set value(value: any[]) {
        this._value = value;
    }
    private _value: any[];

    constructor(injector: Injector, elementRef: ElementRef) {
        super(injector, elementRef);
    }
}
