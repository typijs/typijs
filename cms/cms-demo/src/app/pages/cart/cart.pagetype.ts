import { PageType, Property, UIHint } from '@typijs/core';
import { StandardPage } from '../standard/standard.pagetype';
import { CartComponent } from './cart.component';

@PageType({
    displayName: 'Cart Page',
    componentRef: CartComponent,
    description: 'This is cart page type'
})
export class CartPage extends StandardPage {

}
