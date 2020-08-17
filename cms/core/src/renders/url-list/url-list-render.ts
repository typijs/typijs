import { Component, Injectable, Injector } from '@angular/core';
import { CmsUrl } from '../../types';
import { UIHint } from '../../types/ui-hint';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'nav',
    template: `<ng-container *ngIf="value"><a *ngFor="let link of value" [href]="link.url">{{link.text}}</a></ng-container>`
})
export class UrlListPropertyRender extends CmsPropertyRender<CmsUrl[]> { }


@Injectable()
export class UrlListRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.UrlList, UrlListPropertyRender);
    }
}