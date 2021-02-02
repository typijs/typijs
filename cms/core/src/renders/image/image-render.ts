import { Component, HostBinding, Injectable, Injector, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isUrlAbsolute } from '../../helpers/common';
import { UIHint } from '../../types/ui-hint';
import { CmsImage } from '../../types/image-reference';
import { ConfigService } from '../../config/config.service';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'img',
    template: ``
})
export class ImagePropertyRender extends CmsPropertyRender<CmsImage> implements OnInit {
    @HostBinding('attr.src') src: SafeUrl;
    @HostBinding('attr.alt') alt;

    constructor(private configService: ConfigService, private sanitizer: DomSanitizer) { super(); }

    ngOnInit() {
        if (this.value) {
            const imgSrc = isUrlAbsolute(this.value.src) ? this.value.src : `${this.configService.baseApiUrl}${this.value.src}`;
            this.src = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            this.alt = this.value.alt;
        }
    }
}

@Injectable()
export class ImageRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Image, ImagePropertyRender);
    }
}

