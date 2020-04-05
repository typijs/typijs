import { Component, HostBinding } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';
import { CmsLink } from '../../types';

@Component({
    selector: '[urlRender]',
    template: `<a [href]="value"></a>`
})
export class UrlRender extends CmsPropertyRender {

}