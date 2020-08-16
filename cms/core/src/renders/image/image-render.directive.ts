import { Input, Directive, Injector, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isUrlAbsolute } from '../../helpers/common';
import { CmsImage } from '../../types';
import { ConfigService } from '../../config/config.service';
import { PropertyDirectiveBase } from '../property-directive.base';

@Directive({
    selector: 'img[cmsImage]',
    exportAs: 'cmsImage',
    host: {
        '[attr.src]': 'src',
        '[attr.alt]': 'alt'
    }
})
export class ImageRenderDirective extends PropertyDirectiveBase {
    src: SafeUrl;
    alt: string;

    private _value: CmsImage;
    @Input('cmsImage')
    set value(value: CmsImage) {
        this._value = value;
        if (value) {
            const imgSrc = isUrlAbsolute(value.src) ? value.src : `${this.configService.baseApiUrl}${value.src}`;
            this.src = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            this.alt = value.alt;
        }
    }
    get value(): CmsImage {
        return this._value;
    }

    constructor(
        private configService: ConfigService, 
        private sanitizer: DomSanitizer, 
        injector: Injector, 
        elementRef: ElementRef) { 
        super(injector, elementRef);
    }
}
