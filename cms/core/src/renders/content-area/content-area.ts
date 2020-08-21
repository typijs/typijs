import { Component, Injectable, Injector } from '@angular/core';
import { UIHint } from '../../types/ui-hint';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: '[contentAreaProperty]',
    template: `<ng-container [contentArea]="value"></ng-container>`
})
export class ContentAreaPropertyRender extends CmsPropertyRender<any[]> { }

@Injectable()
export class ContentAreaRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ContentArea, ContentAreaPropertyRender);
    }
}

