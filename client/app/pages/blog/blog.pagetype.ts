import { String } from '../../elements/string/string.type';
import { PageType } from '../../core/page-type.metadata';
import { BlogComponent } from './blog.component';
import { Property } from './../../core/property.metadata';

@PageType({
    displayName: "Blog Page Type",
    component: BlogComponent
})
export class Blog {

    @Property({
        displayName: "Title",
    })
    title: string;
    @Property({
        displayName: "This is content",
    })
    content: string;
}