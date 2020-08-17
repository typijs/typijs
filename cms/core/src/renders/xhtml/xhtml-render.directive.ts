import { Input, Injector, ElementRef, Directive } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PropertyDirectiveBase } from '../property-directive.base';

@Directive({
    selector: '[cmsXhtml], [cmsXHtml]',
    host: {
        '[innerHTML]': 'innerHtml'
    }
})
export class XHtmlRenderDirective extends PropertyDirectiveBase {
    innerHtml: SafeHtml;

    @Input('cmsXhtml')
    set value(value: string) {
        this._value = value;
        if (value)
            this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(value);
    }
    get value(): string {
        return this._value;
    }
    private _value: string;

    constructor(
        injector: Injector,
        elementRef: ElementRef,
        private sanitizer: DomSanitizer) {
        super(injector, elementRef);
    }
}
