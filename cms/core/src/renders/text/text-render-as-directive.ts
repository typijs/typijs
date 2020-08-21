import { Component, Input, Injector, ElementRef } from '@angular/core';
import { PropertyDirectiveBase } from '../property-directive.base';

@Component({
    selector: '[cmsText]',
    template: `{{value}}<ng-content></ng-content>`
})
export class TextRenderDirective extends PropertyDirectiveBase {

    @Input('cmsText')
    get value(): string {
        return this._value;
    }
    set value(value: string) {
        this._value = value;
    }
    private _value: string;

    constructor(injector: Injector, elementRef: ElementRef) {
        super(injector, elementRef);
    }
}
