import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { TestimonyBlock } from './testimony.blocktype';

@Component({
    selector: 'section[testimony-block]',
    host: { 'class': 'ftco-section testimony-section' },
    template: `
    <div class="container">
        <div class="row justify-content-center mb-5 pb-3">
            <div class="col-md-7 heading-section  text-center">
                <span class="subheading" [cmsText]="currentContent.subheading"></span>
                <h2 class="mb-4" [cmsText]="currentContent.heading"></h2>
                <p [cmsXhtml]="currentContent.description"></p>
            </div>
        </div>
        <div class="row ">
				<div class="col-md-12">
					<div class="carousel-testimony owl-carousel" [cmsContentArea]="currentContent.testimonies">
					</div>
				</div>
			</div>
    </div>`
})
export class TestimonyComponent extends CmsComponent<TestimonyBlock> {
    constructor() {
        super();
    }
}
