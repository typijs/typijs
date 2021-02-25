import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { CategoryBlock } from './category.blocktype';

@Component({
    selector: '[category-item]',
    template: `
        <div [class]="'category-wrap  img d-flex align-items-end ' + currentContent.classes"
            [ngStyle]="{ 'background-image': 'url(' + (currentContent.image | toImgSrc) + ')'}">
            <div class="text px-3 py-1">
                <h2 class="mb-0"><a [cmsUrl]="currentContent.link"></a></h2>
            </div>
        </div>
`
})
export class CategoryComponent extends CmsComponent<CategoryBlock> {
    constructor() {
        super();
    }
}
