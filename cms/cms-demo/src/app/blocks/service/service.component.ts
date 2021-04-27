import { CmsComponent } from '@typijs/core';
import { Component } from '@angular/core';
import { ServiceBlock } from './service.blocktype';

@Component({
    selector: 'div[service-item]',
    host: { 'class': 'col-md-3 text-center d-flex align-self-stretch ' },
    template: `
        <div class="media block-6 services mb-md-0 mb-4">
            <div class="icon {{currentContent.background}} active d-flex justify-content-center align-items-center mb-2">
                <span [class]="currentContent.icon"></span>
            </div>
            <div class="media-body">
                <h3 class="heading" [cmsText]="currentContent.heading"></h3>
                <span  [cmsText]="currentContent.subheading"></span>
            </div>
        </div>
`
})
export class ServiceComponent extends CmsComponent<ServiceBlock> {
    constructor() {
        super();
    }
}
