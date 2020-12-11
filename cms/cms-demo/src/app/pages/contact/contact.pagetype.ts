import { PageType, Property, UIHint } from '@angular-cms/core';
import { ContactComponent } from './contact.component';
import { BasePage } from '../base.pagetype';

@PageType({
    displayName: 'Contact Page',
    componentRef: ContactComponent,
    description: 'This is contact page type'
})
export class ContactPage extends BasePage {

}
