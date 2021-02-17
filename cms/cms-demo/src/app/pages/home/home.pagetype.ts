import { Property, PageType, UIHint, PageData, CmsImage, ContentReference } from '@angular-cms/core';
import { GroupName } from '../../shared/group-name';
import { HomeComponent } from './home.component';

@PageType({
    displayName: 'Start Page',
    componentRef: HomeComponent,
    order: 5,
    description: 'This is start page type'
})
export class HomePage extends PageData {

    @Property({
        displayName: 'Text Logo',
        displayType: UIHint.Text,
        groupName: GroupName.HEADER
    })
    textLogo: string;

    @Property({
        displayName: 'Phone number',
        displayType: UIHint.Text,
        groupName: GroupName.HEADER
    })
    phone: string;

    @Property({
        displayName: 'Email',
        displayType: UIHint.Text,
        groupName: GroupName.HEADER
    })
    email: string;

    @Property({
        displayName: 'Header Shipping Text',
        displayType: UIHint.Text,
        groupName: GroupName.HEADER
    })
    headerShippingText: string;

    @Property({
        displayName: 'Main Content',
        displayType: UIHint.ContentArea,
    })
    mainContent: any[];

    @Property({
        displayName: 'Footer Content',
        displayType: UIHint.ContentArea,
        groupName: GroupName.FOOTER
    })
    footerContent: any[];

    @Property({
        displayName: 'Footer Text',
        description: 'This is footer text to show the copyright',
        displayType: UIHint.XHtml,
        groupName: GroupName.FOOTER
    })
    footerText: string;

    @Property({
        displayName: 'Shopping Cart Page',
        description: 'Shopping Cart Page',
        displayType: UIHint.ContentReference,
        allowedTypes: ['CartPage'],
        groupName: GroupName.COMMERCE
    })
    shoppingCartPage: ContentReference;

    @Property({
        displayName: 'Checkout Page',
        description: 'Checkout Page',
        displayType: UIHint.ContentReference,
        allowedTypes: ['CheckoutPage'],
        groupName: GroupName.COMMERCE
    })
    checkoutPage: ContentReference;
}
