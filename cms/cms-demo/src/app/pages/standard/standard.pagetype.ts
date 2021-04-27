import { PageType, Property, UIHint } from '@typijs/core';
import { BasePage } from '../base.pagetype';
import { StandardPageComponent } from './standard.component';

@PageType({
    displayName: 'Standard Page',
    componentRef: StandardPageComponent,
    order: 10,
    description: 'This is standard page type'
})
export class StandardPage extends BasePage {

    @Property({
        displayName: 'Top Content',
        displayType: UIHint.ContentArea,
        groupName: 'Content Area'
    })
    topContent: any[];

    @Property({
        displayName: 'Main Content',
        displayType: UIHint.ContentArea,
        groupName: 'Content Area'
    })
    mainContent: any[];

    @Property({
        displayName: 'Bottom Content',
        displayType: UIHint.ContentArea,
        groupName: 'Content Area'
    })
    bottomContent: any[];
}
