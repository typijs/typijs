import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { CarouselBlock } from './carousel.blocktype';

@Component({
    selector: 'section[carousel-block]',
    host: { 'class': 'hero', 'id': 'home-section' },
    template: `<div class="home-slider owl-carousel" [cmsContentArea]="currentContent.carouselItems"></div>`
})
export class CarouselComponent extends CmsComponent<CarouselBlock> {
    constructor() {
        super();
    }
}
