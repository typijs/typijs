import { Property, PageType, UIHint, PageData, CmsImage, ContentReference } from '@angular-cms/core';
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
        groupName: 'Header'
    })
    textLogo: string;

    @Property({
        displayName: 'Phone number',
        displayType: UIHint.Text,
        groupName: 'Header'
    })
    phone: string;

    @Property({
        displayName: 'Email',
        displayType: UIHint.Text,
        groupName: 'Header'
    })
    email: string;

    @Property({
        displayName: 'Header Shipping Text',
        displayType: UIHint.Text,
        groupName: 'Header'
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
        groupName: 'Footer'
    })
    footerContent: any[];

    @Property({
        displayName: 'Footer Text',
        description: 'This is footer text to show the copyright',
        displayType: UIHint.XHtml,
        groupName: 'Footer'
    })
    footerText: string;
}
