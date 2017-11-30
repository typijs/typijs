import { PageType } from '../../core/page-type.metadata';
import { Property } from './../../core/property.metadata';
import { Elements } from './../../elements/register';

@PageType({
    displayName: "Blog List Page Type",
})
export class BlogList {
    @Property({
        displayName: "This is Title",
        formDisplayType: Elements.String
    })
    title: string;
    content: string;
}