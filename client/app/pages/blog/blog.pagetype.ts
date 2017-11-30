import { PageType } from '../../core/page-type.metadata';
import { BlogComponent } from './blog.component';
import { Property } from './../../core/property.metadata';
import { Elements } from './../../elements/register';

@PageType({
    displayName: "Blog Page Type",
    component: BlogComponent
})
export class Blog {

    @Property({
        displayName: "Title",
        formDisplayType: Elements.String
    })
    title: string;
    @Property({
        displayName: "This is content",
        formDisplayType: Elements.String
    })
    content: string;
}