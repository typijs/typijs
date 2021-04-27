import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { CategoryContainerBlock } from './category-container.blocktype';

@Component({
	selector: 'section[category-container]',
	host: { 'class': 'ftco-section ftco-category ftco-no-pt' },
	template: `
    <div class="container">
			<div class="row">
				<div class="col-md-8">
					<div class="row">
						<div class="col-md-6 order-md-last align-items-stretch d-flex">
							<div class="category-wrap-2  img align-self-stretch d-flex"
                            [ngStyle]="{ 'background-image': 'url(' + (currentContent.image | toImgSrc) + ')'}">
								<div class="text text-center">
									<h2 [cmsText]="currentContent.heading"></h2>
									<p [cmsText]="currentContent.subheading"></p>
									<p><a *ngIf="currentContent.link" [cmsUrl]="currentContent.link" class="btn btn-primary">{{currentContent.link.text}}</a></p>
								</div>
							</div>
						</div>
						<div class="col-md-6" [cmsContentArea]="currentContent.leftCategories">
						</div>
					</div>
				</div>

				<div class="col-md-4" [cmsContentArea]="currentContent.rightCategories">
				</div>
			</div>
		</div>`
})
export class CategoryContainerComponent extends CmsComponent<CategoryContainerBlock> {
	constructor() {
		super();
	}
}
