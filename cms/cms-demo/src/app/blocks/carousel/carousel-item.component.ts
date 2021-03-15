import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { CarouselItemBlock } from './carousel-item.blocktype';
@Component({
    selector: '[carousel-item-block]',
    template: `
    <div class="slider-item" [ngStyle]="{ 'background-image': 'url(' + (currentContent.image | toImgSrc) + ')'}">
        <div class="overlay"></div>
        <div class="container">
            <div class="row slider-text justify-content-center align-items-center">
                <div class="col-md-12  text-center">
                    <h1 class="mb-2" [cmsText]="currentContent.heading"></h1>
                    <h2 class="subheading mb-4" [cmsText]="currentContent.subheading"></h2>
                    <p><a [cmsUrl]="currentContent.url" class="btn btn-primary">{{currentContent.url?.text}}</a></p>
                </div>
            </div>
        </div>
    </div>
`
})
export class CarouselItemComponent extends CmsComponent<CarouselItemBlock> {
    constructor() {
        super();
    }
}
