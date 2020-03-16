import { Component } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';

@Component({
    selector: '[xhtmlRender]',
    template: `<div [innerHTML]="value"></div>`
})
export class XHtmlRender extends CmsPropertyRender {

}