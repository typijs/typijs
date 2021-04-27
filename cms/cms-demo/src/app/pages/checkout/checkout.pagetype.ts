import { PageType, Property, UIHint } from '@typijs/core';
import { StandardPage } from '../standard/standard.pagetype';
import { CheckoutComponent } from './checkout.component';

@PageType({
    displayName: 'Checkout Page',
    componentRef: CheckoutComponent,
    description: 'This is checkout page type'
})
export class CheckoutPage extends StandardPage {

}
