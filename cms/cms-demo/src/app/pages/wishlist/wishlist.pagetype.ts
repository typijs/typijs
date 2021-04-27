import { PageType, Property, UIHint } from '@typijs/core';
import { StandardPage } from '../standard/standard.pagetype';
import { WishlistComponent } from './wishlist.component';

@PageType({
    displayName: 'Wishlist Page',
    componentRef: WishlistComponent,
    description: 'This is wishlist page type'
})
export class WishlistPage extends StandardPage {

}
