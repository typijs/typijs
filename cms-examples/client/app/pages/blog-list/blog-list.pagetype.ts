import { Property, PageType } from './../../cms/core/decorators';
import { UIType } from '../../cms/core/index';

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