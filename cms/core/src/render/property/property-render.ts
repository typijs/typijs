import { Input, Component, HostBinding } from '@angular/core';
import { ContentTypeProperty } from '../../types/content-type';
import { CmsImage, CmsLink } from '../../types';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

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

    constructor(protected sanitizer: DomSanitizer) { super(); }

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

    constructor(protected sanitizer: DomSanitizer) { super(); }
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

    constructor(protected sanitizer: DomSanitizer) { super(); }
    protected onValueChange(value: CmsImage) {
        if (value) {
            this.src = this.sanitizer.bypassSecurityTrustUrl(value.src);
            this.alt = value.alt;
        }
    }
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
