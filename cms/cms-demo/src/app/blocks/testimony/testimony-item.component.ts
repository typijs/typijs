import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { TestimonyItemBlock } from './testimony-item.blocktype';

@Component({
    selector: 'div[testimony-item-block]',
    host: { 'class': 'item' },
    template: `
    <div class="testimony-wrap p-4 pb-5">
        <div class="user-img mb-5" [ngStyle]="{ 'background-image': 'url(' + (currentContent.avatar | toImgSrc) + ')'}">
            <span class="quote d-flex align-items-center justify-content-center">
                <i class="icon-quote-left"></i>
            </span>
        </div>
        <div class="text text-center">
            <p class="mb-5 pl-4 line" [cmsXhtml]="currentContent.quote"></p>
            <p class="name" [cmsText]="currentContent.name"></p>
            <span class="position" [cmsText]="currentContent.position"></span>
        </div>
    </div>
`
})
export class TestimonyItemComponent extends CmsComponent<TestimonyItemBlock> {
    constructor() {
        super();
    }
}
