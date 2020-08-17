import { Component, Injectable, Injector } from '@angular/core';
import { UIHint } from '../../types/ui-hint';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'ul',
    template: `<ng-container *ngIf="value"><li *ngFor="let item of value">{{item | json}}</li></ng-container>`
})
export class ObjectListPropertyRender extends CmsPropertyRender<Array<any>> { }


@Injectable()
export class ObjectListRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ObjectList, ObjectListPropertyRender);
    }
}