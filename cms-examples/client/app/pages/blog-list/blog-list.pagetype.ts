import { Property, PageType, UIType } from '@angular-cms/core';

@PageType({
    displayName: "Blog List Page Type",
    description: "This is blog list page type"
})
export class BlogList {
    @Property({
        displayName: "This is Title",
        displayType: UIType.Input
    })
    title: string;
    content: string;
}