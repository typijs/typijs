import { Component, Input, Injector, ElementRef } from '@angular/core';
import { CmsUrl } from '../../types';
import { PropertyDirectiveBase } from '../property-directive.base';

@Component({
    selector: '[cmsUrlList]',
    template: `<ng-container *ngIf="value">
                    <a *ngFor="let link of value" [href]="link.url | safe:'url'">{{link.text}}</a>
                </ng-container><ng-content></ng-content>`
})
export class UrlListRenderDirective extends PropertyDirectiveBase {
    @Input('cmsUrlList')
    set value(value: CmsUrl[]) {
        this._value = value;
    }
    get value(): CmsUrl[] {
        return this._value;
    }
    private _value: CmsUrl[];

    constructor(injector: Injector, elementRef: ElementRef) {
        super(injector, elementRef);
    }
}
