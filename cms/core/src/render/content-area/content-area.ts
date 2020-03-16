import { Component } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';

@Component({
    selector: '[contentAreaRender]',
    template: `<ng-container [cmsContentArea]="value"></ng-container>`
})
export class ContentAreaRender extends CmsPropertyRender {

}