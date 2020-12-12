import { PageType, Property, UIHint } from '@angular-cms/core';
import { BasePage } from '../base.pagetype';
import { StandardPageComponent } from './standard.component';

@PageType({
    displayName: 'Standard Page',
    componentRef: StandardPageComponent,
    description: 'This is standard page type'
})
export class StandardPage extends BasePage {

    @Property({
        displayName: 'Top Content',
        displayType: UIHint.ContentArea,
    })
    topContent: any[];

    @Property({
        displayName: 'Main Content',
        displayType: UIHint.ContentArea,
    })
    mainContent: any[];

    @Property({
        displayName: 'Bottom Content',
        displayType: UIHint.ContentArea,
    })
    bottomContent: any[];
}
