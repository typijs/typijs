import { PageType, Property, UIHint } from '@angular-cms/core';
import { StandardPage } from '../standard/standard.pagetype';
import { ProductComponent } from './product.component';

@PageType({
    displayName: 'Product Page',
    componentRef: ProductComponent,
    description: 'This is product page type'
})
export class ProductPage extends StandardPage {

    @Property({
        displayName: 'Images',
        displayType: UIHint.ContentArea,
    })
    images: any[];

    @Property({
        displayName: 'Product Code',
        displayType: UIHint.Text,
    })
    productCode: string;

    @Property({
        displayName: 'Price',
        displayType: UIHint.Text,
    })
    price: string;

    @Property({
        displayName: 'Inventory',
        displayType: UIHint.Text,
    })
    inventory: string;

    @Property({
        displayName: 'Product Description',
        displayType: UIHint.XHtml,
    })
    description: string;

    @Property({
        displayName: 'Variants',
        displayType: UIHint.ObjectList,
    })
    variants: string;
}
