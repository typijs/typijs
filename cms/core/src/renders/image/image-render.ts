import { Component, HostBinding, Injectable, Injector } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isUrlAbsolute } from '../../helpers/common';
import { UIHint } from '../../types/ui-hint';
import { CmsImage } from '../../types';
import { ConfigService } from '../../config/config.service';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'img',
    template: ``
})
export class ImagePropertyRender extends CmsPropertyRender<CmsImage> {
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

@Injectable()
export class ImageRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Image, ImagePropertyRender);
    }
}

