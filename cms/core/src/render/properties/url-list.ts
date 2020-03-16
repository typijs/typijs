import { Component } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';

@Component({
    selector: '[urlListRender]',
    template: `<a *ngFor="let url of value" [href]="url"></a>`
})
export class UrlListRender extends CmsPropertyRender {

}