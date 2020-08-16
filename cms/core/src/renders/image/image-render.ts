import { Component, HostBinding } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isUrlAbsolute } from '../../helpers/common';
import { CmsImage } from '../../types';
import { ConfigService } from '../../config/config.service';
import { CmsPropertyRender } from '../property-render';

@Component({
    selector: 'img',
    template: ``
})
export class ImagePropertyRender extends CmsPropertyRender {
    @HostBinding('attr.src') src: SafeUrl;
    @HostBinding('attr.alt') alt;

    constructor(private configService: ConfigService, private sanitizer: DomSanitizer) { super(); }
    protected onValueChange(value: CmsImage) {
        if (value) {
            const imgSrc = isUrlAbsolute(value.src) ? value.src : `${this.configService.baseApiUrl}${value.src}`;
            this.src = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            this.alt = value.alt;
        }
    }
}
