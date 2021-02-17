import { PageType, Property, UIHint } from '@angular-cms/core';
import { BlogComponent } from './blog.component';
import { BasePage } from '../base.pagetype';

@PageType({
    displayName: 'Blog List Page',
    componentRef: BlogComponent,
    description: 'This is blog list page type'
})
export class BlogPage extends BasePage {
    @Property({
        displayName: 'Number Items Per Page',
        displayType: UIHint.Text
    })
    numberItemsPerPage: number;
}
