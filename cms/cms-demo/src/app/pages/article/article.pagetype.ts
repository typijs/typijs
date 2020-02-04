import { Property, PageType, UIHint, ValidationTypes, PageData } from '@angular-cms/core';
import { ArticleComponent } from './article.component';

@PageType({
    displayName: "Article Page",
    componentRef: ArticleComponent,
    description: "This is article page type"
})
export class ArticlePage extends PageData {

    @Property({
        displayName: "Title",
        displayType: UIHint.Input,
        validates: [ValidationTypes.required("This field is required")]
    })
    title: string;

    @Property({
        displayName: "Author",
        displayType: UIHint.Input
    })
    author: string;

    @Property({
        displayName: "Image Teaser",
        displayType: UIHint.Input
    })
    image: string;

    @Property({
        displayName: "Summary",
        displayType: UIHint.Xhtml,
        validates: [ValidationTypes.required("This field is required")]
    })
    summary: string;

    @Property({
        displayName: "Content",
        displayType: UIHint.Xhtml
    })
    content: string;

    @Property({
        displayName: "Published Date",
        displayType: UIHint.Input
    })
    publishedDate: string;
}