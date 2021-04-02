import { Input, Directive, Injector, ElementRef, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isUrlAbsolute } from '../../helpers/common';
import { CmsImage } from '../../types/cms-image';
import { ConfigService } from '../../config/config.service';
import { PropertyDirectiveBase } from '../property-directive.base';

@Directive({
    selector: 'img[cmsImage]',
    exportAs: 'cmsImage'
})
export class ImageRenderDirective extends PropertyDirectiveBase implements OnInit {
    @HostBinding('attr.src') src: SafeUrl;
    @HostBinding('attr.alt') alt: string;

    @Input() cmsImage: CmsImage;

    constructor(
        private configService: ConfigService,
        private sanitizer: DomSanitizer,
        injector: Injector,
        elementRef: ElementRef) {
        super(injector, elementRef);
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.cmsImage) {
            const imgSrc = isUrlAbsolute(this.cmsImage.src) ? this.cmsImage.src : `${this.configService.baseApiUrl}${this.cmsImage.src}`;
            this.src = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            this.alt = this.cmsImage.alt;
        }
    }
}
