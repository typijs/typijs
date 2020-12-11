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
        displayName: 'Main Content',
        displayType: UIHint.ContentArea,
    })
    mainContent: any[];

}
