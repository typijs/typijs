import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { PartnerBlock } from './partner.blocktype';

@Component({
    selector: 'div[partner-block]',
    host: { 'class': 'col-sm ' },
    template: `
    <a class="partner" [cmsUrl]="currentContent.link">
        <img class="img-fluid" [cmsImage]="currentContent.image"/>
    </a>
`
})
export class PartnerComponent extends CmsComponent<PartnerBlock> {
    constructor() {
        super();
    }
}
