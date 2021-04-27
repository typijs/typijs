import { CmsComponent, PageService } from '@typijs/core';
import { Component } from '@angular/core';
import { ProductPage } from './product.pagetype';

@Component({
    templateUrl: 'product.component.html'
})
export class ProductComponent extends CmsComponent<ProductPage> {
    constructor(private contentService: PageService) {
        super();
    }
}
