import { CmsComponent, PageService } from '@angular-cms/core';
import { Component } from '@angular/core';
import { ProductListingPage } from './product-listing.pagetype';

@Component({
    templateUrl: 'product-listing.component.html'
})
export class ProductListingComponent extends CmsComponent<ProductListingPage> {
    constructor(private contentService: PageService) {
        super();
    }
}
