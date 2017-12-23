import { Property, PageType } from 'angular-cms/src/core/decorators';
import { UIType } from 'angular-cms/src/core/index';

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