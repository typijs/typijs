import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { CategoryBlock } from './category.blocktype';

@Component({
    selector: '[category-item]',
    template: `
        <div class="category-wrap ftco-animate img mb-4 d-flex align-items-end"
            [ngStyle]="{ 'background-image': 'url(' + (currentContent.image | toImgSrc) + ')'}">
            <div class="text px-3 py-1">
                <h2 class="mb-0"><a href="#" [cmsText]="currentContent.heading"></a></h2>
            </div>
        </div>
`
})
export class CategoryComponent extends CmsComponent<CategoryBlock> {
    constructor() {
        super();
    }
}
