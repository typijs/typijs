import { Component, HostBinding, Input, Directive } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

import { isUrlAbsolute } from '../../../helpers/common';
import { CmsImage, CmsLink } from '../../../types';
import { ContentTypeProperty } from '../../../types/content-type';
import { ConfigService } from '../../config/config.service';

export abstract class CmsPropertyRender {
    @Input()
    set value(value: any) {
        this._value = value;
        this.onValueChange(value);
    }
    get value(): any {
        return this._value;
    }
    private _value: any;

    @Input()
    property: ContentTypeProperty;

    protected onValueChange(value): void { }
}

@Component({
    selector: 'span',
    template: `{{value}}`
})
export class TextRender extends CmsPropertyRender { }

@Component({
    selector: 'div',
    template: ``
})
export class XHtmlRender extends CmsPropertyRender {
    @HostBinding('innerHTML') innerHtml: SafeHtml;

    constructor(private sanitizer: DomSanitizer) { super(); }

    protected onValueChange(value: string) {
        if (value) this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(value);
    }
}

@Component({
    selector: 'a',
    template: `{{value.text}}`
})
export class UrlRender extends CmsPropertyRender {
    @HostBinding('attr.href') href: SafeUrl;
    @HostBinding('attr.target') target;

    constructor(private sanitizer: DomSanitizer) { super(); }
    protected onValueChange(value: CmsLink) {
        if (value) {
            this.href = this.sanitizer.bypassSecurityTrustUrl(value.url);
            this.target = value.target;
        }
    }
}

@Component({
    selector: 'img',
    template: ``
})
export class ImageRender extends CmsPropertyRender {
    @HostBinding('attr.src') src: SafeUrl;
    @HostBinding('attr.alt') alt;

    constructor(private configService: ConfigService, private sanitizer: DomSanitizer) { super(); }
    protected onValueChange(value: CmsImage) {
        if (value) {
            const imgSrc = isUrlAbsolute(value.src) ? value.src : `${this.configService.baseApiUrl}${value.src}`
            this.src = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            this.alt = value.alt;
        }
    }
}

@Directive({
    selector: 'img[cmsImage]',
    exportAs: 'cmsImage',
    host: {
        '[attr.src]': 'src',
        '[attr.alt]': 'alt'
    }
})
export class CmsImageRender {
    src: SafeUrl;
    alt: string;

    private _value: CmsImage;
    @Input('cmsImage')
    set value(value: CmsImage) {
        this._value = value;
        if (value) {
            const imgSrc = isUrlAbsolute(value.src) ? value.src : `${this.configService.baseApiUrl}${value.src}`
            this.src = this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            this.alt = value.alt;
        }
    }
    get value(): CmsImage {
        return this._value;
    }

    constructor(private configService: ConfigService, private sanitizer: DomSanitizer) { }
}

@Component({
    selector: 'nav',
    template: `<ng-container *ngIf="value"><a *ngFor="let link of value" [href]="link.url">{{link.text}}</a></ng-container>`
})
export class UrlListRender extends CmsPropertyRender { }

@Component({
    selector: 'ul',
    template: `<ng-container *ngIf="value"><li *ngFor="let item of value">{{item | json}}</li></ng-container>`
})
export class ObjectListRender extends CmsPropertyRender { }
