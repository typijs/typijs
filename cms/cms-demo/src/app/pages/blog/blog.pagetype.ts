import { PageType } from '@angular-cms/core';
import { BlogComponent } from './blog.component';
import { PortfolioPage } from '../portfolio/portfolio.pagetype';

@PageType({
    displayName: "Blog List Page",
    componentRef: BlogComponent,
    description: "This is blog list page type"
})
export class BlogPage extends PortfolioPage {
}