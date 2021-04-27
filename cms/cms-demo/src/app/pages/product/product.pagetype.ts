import { CmsImage, PageType, Property, UIHint } from '@typijs/core';
import { StandardPage } from '../standard/standard.pagetype';
import { ProductPartialComponent } from './product-partial.component';
import { ProductComponent } from './product.component';

export class Variant {
    @Property({
        displayName: 'Variant Code',
        displayType: UIHint.Text
    })
    code: string;

    @Property({
        displayName: 'Size',
        displayType: UIHint.Text
    })
    size: string;
}

@PageType({
    displayName: 'Product Page',
    componentRef: ProductComponent,
    partialComponentRef: ProductPartialComponent,
    description: 'This is product page type'
})
export class ProductPage extends StandardPage {

    @Property({
        displayName: 'Main Image',
        displayType: UIHint.Image,
    })
    image: CmsImage;

    @Property({
        displayName: 'Images',
        displayType: UIHint.ContentArea,
    })
    images: any[];

    @Property({
        displayName: 'Product Description',
        displayType: UIHint.XHtml,
    })
    description: string;

    @Property({
        displayName: 'Product Code',
        displayType: UIHint.Text,
        groupName: 'Commerce'
    })
    productCode: string;

    @Property({
        displayName: 'Price',
        displayType: UIHint.Text,
        groupName: 'Commerce'
    })
    price: string;

    @Property({
        displayName: 'Inventory',
        displayType: UIHint.Text,
        groupName: 'Commerce'
    })
    inventory: string;

    @Property({
        displayName: 'Variants',
        displayType: UIHint.ObjectList,
        objectListItemType: Variant,
        groupName: 'Commerce'
    })
    variants: Variant[];
}
