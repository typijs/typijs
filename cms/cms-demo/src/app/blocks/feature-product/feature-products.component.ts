import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { FeatureProductsBlock } from './feature-product.blocktype';

@Component({
    selector: 'section[feature-products-block]',
    host: { 'class': 'ftco-section' },
    template: `
    <div class="container">
        <div class="row justify-content-center mb-3 pb-3">
            <div class="col-md-12 heading-section text-center ">
                <span class="subheading" [cmsText]="currentContent.subheading"></span>
                <h2 class="mb-4" [cmsText]="currentContent.heading"></h2>
                <p [cmsXhtml]="currentContent.description"></p>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row" [cmsContentArea]="currentContent.products">
        </div>
    </div>`
})
export class FeatureProductsComponent extends CmsComponent<FeatureProductsBlock> {
    constructor() {
        super();
    }
}
