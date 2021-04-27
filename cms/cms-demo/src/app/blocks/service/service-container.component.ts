import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { ServiceContainerBlock } from './service-container.blocktype';

@Component({
    selector: 'section[service-container]',
    host: { 'class': 'ftco-section' },
    template: `
    <div class="container">
        <div class="row no-gutters ftco-services" [cmsContentArea]="currentContent.services"></div>
    </div>`
})
export class ServiceContainerComponent extends CmsComponent<ServiceContainerBlock> {
    constructor() {
        super();
    }
}
