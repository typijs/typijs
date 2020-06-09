import { Component } from '@angular/core';
import { CmsPropertyRender } from "../property/property-render";

@Component({
    selector: '[contentAreaRender]',
    template: `<ng-container [cmsContentArea]="value"></ng-container>`
})
export class ContentAreaRender extends CmsPropertyRender {

}