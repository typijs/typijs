import { Component, HostBinding, Injectable, Injector } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UIHint } from '../../types/ui-hint';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'div',
    template: ``
})
export class XHtmlPropertyRender extends CmsPropertyRender<string> {
    @HostBinding('innerHTML') innerHtml: SafeHtml;

    constructor(private sanitizer: DomSanitizer) { super(); }

    protected onValueChange(value: string) {
        if (value) { this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(value); }
    }
}

@Injectable()
export class XHtmlRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.XHtml, XHtmlPropertyRender);
    }
}
