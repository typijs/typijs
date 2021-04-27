import { CmsComponent } from '@typijs/core';
import { Component } from '@angular/core';
import { BestPriceBlock } from './best-price.blocktype';

@Component({
    selector: '[best-price-block]',
    template: `
    <section class="ftco-section img" [ngStyle]="{ 'background-image': 'url(' + (currentContent.backgroundImage | toImgSrc) + ')'}">
        <div class="container">
            <div class="row justify-content-end">
                <div class="col-md-6 heading-section  deal-of-the-day ">
                    <span class="subheading" [cmsText]="currentContent.subheading"></span>
                    <h2 class="mb-4" [cmsText]="currentContent.heading"></h2>
                    <div [cmsXhtml]="currentContent.description"></div>
                    <div id="timer" class="d-flex mt-5">
                        <div class="time" id="days"></div>
                        <div class="time pl-3" id="hours"></div>
                        <div class="time pl-3" id="minutes"></div>
                        <div class="time pl-3" id="seconds"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`
})
export class BestPriceComponent extends CmsComponent<BestPriceBlock> {
    constructor() {
        super();
    }
}
