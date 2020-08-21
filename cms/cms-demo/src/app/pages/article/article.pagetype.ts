import { Property, PageType, UIHint, ValidationTypes, PageData, CmsImage } from '@angular-cms/core';
import { ArticleComponent } from './article.component';

@PageType({
    displayName: 'Article Page',
    componentRef: ArticleComponent,
    description: 'This is article page type'
})
export class ArticlePage extends PageData {

    @Property({
        displayName: 'Title',
        displayType: UIHint.Text,
        validates: [ValidationTypes.required('This field is required')]
    })
    title: string;

    @Property({
        displayName: 'Author',
        displayType: UIHint.Text
    })
    author: string;

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
