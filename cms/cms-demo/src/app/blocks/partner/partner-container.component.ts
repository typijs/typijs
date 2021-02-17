import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { PartnerContainerBlock } from './partner-container.blocktype';

@Component({
    selector: 'section[partner-container-block]',
    host: { 'class': 'ftco-section ftco-partner' },
    template: `
    <div class="container">
        <div class="row" [cmsContentArea]="currentContent.partners"></div>
    </div>`
})
export class PartnerContainerComponent extends CmsComponent<PartnerContainerBlock> {
    constructor() {
        super();
    }
}
