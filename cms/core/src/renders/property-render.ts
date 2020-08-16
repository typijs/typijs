import { Component, HostBinding, Input, Injector, ElementRef, Directive } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

import { CmsLink } from '../types';
import { ContentTypeProperty } from '../types/content-type';
import { PropertyDirectiveBase } from './property-directive.base';

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
export class TextPropertyRender extends CmsPropertyRender { }

@Component({
    selector: '[cmsText]',
    template: `{{value}}<ng-content></ng-content>`
})
export class TextRender extends PropertyDirectiveBase {
    private _value: Array<any>;

    @Input('cmsText')
    set value(value: Array<any>) {
        this._value = value;
    }
    get value(): Array<any> {
        return this._value;
    }

    constructor(
        injector: Injector,
        elementRef: ElementRef) {
        super(injector, elementRef);
    }
}

@Component({
    selector: 'div',
    template: ``
})
export class XHtmlPropertyRender extends CmsPropertyRender {
    @HostBinding('innerHTML') innerHtml: SafeHtml;

    constructor(private sanitizer: DomSanitizer) { super(); }

    protected onValueChange(value: string) {
        if (value) this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(value);
    }
}

@Directive({
    selector: '[cmsXhtml], [cmsXHtml]',
    host: {
        '[innerHTML]': 'innerHtml'
    }
})
export class XHtmlDirective extends PropertyDirectiveBase {
    innerHtml: SafeHtml;
    
    private _value: string;
    @Input('cmsXhtml')
    set value(value: string) {
        this._value = value;
        if (value) this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(value);
    }
    get value(): string {
        return this._value;
    }

    constructor(
        injector: Injector,
        elementRef: ElementRef,
        private sanitizer: DomSanitizer) {
        super(injector, elementRef);
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

@Directive({
    selector: 'a[cmsUrl]',
    host: {
        '[attr.href]': 'src',
        '[attr.target]': 'alt'
    }
})
export class UrlDirective extends PropertyDirectiveBase {
    href: SafeUrl;
    target;

    private _value: CmsLink;
    @Input('cmsUrl')
    set value(value: CmsLink) {
        this._value = value;
        if (value) {
            this.href = this.sanitizer.bypassSecurityTrustUrl(value.url);
            this.target = value.target;
        }
    }
    get value(): CmsLink {
        return this._value;
    }

    constructor(
        injector: Injector, 
        elementRef: ElementRef,
        private sanitizer: DomSanitizer) { 
        super(injector, elementRef);
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
