import { Component, HostBinding } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';
import { CmsLink } from '../../types';

@Component({
    selector: 'a',
    template: `{{cmsLink.text}}`
})
export class UrlRender extends CmsPropertyRender {
    @HostBinding('attr.href') src = this.cmsLink.url; 
    @HostBinding('attr.target') alt = this.cmsLink.target; 
    get cmsLink(): CmsLink {
        return this.value
    }
}