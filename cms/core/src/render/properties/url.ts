import { Component } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';

@Component({
    selector: '[urlRender]',
    template: `<a [href]="value"></a>`
})
export class UrlRender extends CmsPropertyRender {

}