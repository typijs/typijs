import { Component, Injectable, Injector } from '@angular/core';
import { clone } from '../../helpers/common';
import { Content } from '../../services/content/models/content.model';
import { ContentTypeProperty } from '../../types/content-type';
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
    constructor(injector: Injector,) {
        super(injector, UIHint.ContentArea, ContentAreaPropertyRender);
    }

    getPopulatedReferenceProperty(contentData: Content, property: ContentTypeProperty): any {
        const childItems = contentData.childItems;
        const fieldValue = contentData.properties[property.name];
        if (Array.isArray(fieldValue)) {
            for (let i = 0; i < fieldValue.length; i++) {
                const matchItem = childItems.find(x => x.content && x.content._id == fieldValue[i]._id);
                if (matchItem) {
                    fieldValue[i] = clone(matchItem.content);
                }
            }
        }
        return fieldValue;
    }

}
