import { Property, PageType, UIHint, ValidationTypes, PageData } from '@angular-cms/core';
import { PortfolioComponent } from './portfolio.component';

@PageType({
    displayName: 'Portfolio Page',
    componentRef: PortfolioComponent,
    description: 'This is portfolio page type'
})
export class PortfolioPage extends PageData {

    @Property({
        displayName: 'Header',
        displayType: UIHint.Text,
        validates: [ValidationTypes.required('This field is required')]
    })
    header: string;

    @Property({
        displayName: 'Number Items Per Page',
        displayType: UIHint.Text
    })
    numberItemsPerPage: number;
}
