import { CmsImage, PageType, Property, UIHint, ValidationTypes } from '@typijs/core';
import { BasePage } from '../base.pagetype';
import { ArticleComponent } from './article.component';

@PageType({
    displayName: 'Article Page',
    componentRef: ArticleComponent,
    description: 'This is article page type'
})
export class ArticlePage extends BasePage {

    @Property({
        displayName: 'Title',
        displayType: UIHint.Text,
        validates: [ValidationTypes.required('This field is required')]
    })
    title: string;

    @Property({
        displayName: 'Tags',
        displayType: UIHint.Text,
    })
    tags: string;

    @Property({
        displayName: 'Author',
        displayType: UIHint.ContentArea
    })
    author: any[];

    @Property({
        displayName: 'Image Teaser',
        displayType: UIHint.Image
    })
    image: CmsImage;

    @Property({
        displayName: 'Summary',
        displayType: UIHint.XHtml,
        validates: [ValidationTypes.required('This field is required')]
    })
    summary: string;

    @Property({
        displayName: 'Content',
        displayType: UIHint.XHtml
    })
    content: string;

    @Property({
        displayName: 'Published Date',
        displayType: UIHint.Text
    })
    publishedDate: string;
}
