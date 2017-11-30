import { String } from '../../elements/string/string.type';
import { PageType } from '../../core/page-type.metadata';
import { Property } from './../../core/property.metadata';

@PageType({
    displayName: "Blog List Page Type",
})
export class BlogList {
    @Property({
        displayName: "This is Title",
    })
    title: string;
    content: String;
}