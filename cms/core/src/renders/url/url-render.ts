import { Component, HostBinding, Injectable, Injector } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CmsUrl } from '../../types';
import { UIHint } from '../../types/ui-hint';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'a',
    template: `{{value.text}}`
})
export class UrlPropertyRender extends CmsPropertyRender<CmsUrl> {
    @HostBinding('attr.href') href: SafeUrl;
    @HostBinding('attr.target') target;

    constructor(private sanitizer: DomSanitizer) { super(); }
    protected onValueChange(value: CmsUrl) {
        if (value) {
            this.href = this.sanitizer.bypassSecurityTrustUrl(value.url);
            this.target = value.target;
        }
    }
}

@Injectable()
export class UrlRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Url, UrlPropertyRender);
    }
}

