import { Component } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';
@Component({
    selector: '[textRender]',
    template: `<ng-container>{{value}}</ng-container>`
})
export class TextRender extends CmsPropertyRender {

}