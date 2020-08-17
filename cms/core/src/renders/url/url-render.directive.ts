import { Input, Injector, ElementRef, Directive } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CmsUrl } from '../../types';
import { PropertyDirectiveBase } from '../property-directive.base';

@Directive({
    selector: 'a[cmsUrl]',
    host: {
        '[attr.href]': 'src',
        '[attr.target]': 'alt'
    }
})
export class UrlRenderDirective extends PropertyDirectiveBase {
    href: SafeUrl;
    target;

    private _value: CmsUrl;
    @Input('cmsUrl')
    set value(value: CmsUrl) {
        this._value = value;
        if (value) {
            this.href = this.sanitizer.bypassSecurityTrustUrl(value.url);
            this.target = value.target;
        }
    }
    get value(): CmsUrl {
        return this._value;
    }

    constructor(
        injector: Injector,
        elementRef: ElementRef,
        private sanitizer: DomSanitizer) {
        super(injector, elementRef);
    }
}
