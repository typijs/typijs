import { CmsComponent, PageService } from '@angular-cms/core';
import { Component } from '@angular/core';
import { CartPage } from './cart.pagetype';

@Component({
    templateUrl: 'cart.component.html'
})
export class CartComponent extends CmsComponent<CartPage> {
    constructor(private contentService: PageService) {
        super();
    }
}
