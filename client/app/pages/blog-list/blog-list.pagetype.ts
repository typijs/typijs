import { String } from '../../elements/string/string.type';
import { PageType } from '../../core/page-type.metadata';

@PageType({
    displayName: "Blog List Page Type",
})
export class BlogList {
    title: String;
    content: String;
}