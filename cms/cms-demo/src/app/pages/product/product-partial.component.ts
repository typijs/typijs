import { CmsComponent, PageService } from '@angular-cms/core';
import { Component } from '@angular/core';
import { ProductPage } from './product.pagetype';

@Component({
    selector: 'div[product-partial]',
    host: { 'class': 'col-md-6 col-lg-3' },
    template: `
        <div class="product">
            <a [cmsUrl]="currentContent.contentLink | toUrl" target="_blank" class="img-prod">
                <img class="img-fluid" [src]="currentContent.image | toImgSrc" alt="{{currentContent.name}}">
                <div class="overlay"></div>
            </a>
            <div class="text py-3 pb-4 px-3 text-center">
                <h3><a [cmsUrl]="currentContent.contentLink | toUrl" [cmsText]="currentContent.name"></a></h3>
                <div class="d-flex">
                    <div class="pricing">
                        <p class="price"><span [cmsText]="currentContent.price"></span></p>
                    </div>
                </div>
                <div class="bottom-area d-flex px-3">
                    <div class="m-auto d-flex">
                        <a href="#" class="add-to-cart d-flex justify-content-center align-items-center text-center">
                            <span><i class="ion-ios-menu"></i></span>
                        </a>
                        <a href="#" class="buy-now d-flex justify-content-center align-items-center mx-1">
                            <span><i class="ion-ios-cart"></i></span>
                        </a>
                        <a href="#" class="heart d-flex justify-content-center align-items-center ">
                            <span><i class="ion-ios-heart"></i></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ProductPartialComponent extends CmsComponent<ProductPage> {
    constructor(private contentService: PageService) {
        super();
    }
}
