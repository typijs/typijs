import { BlogComponent } from './blog.component';
import { Property, PageType } from './../../cms/core/decorators';
import { Elements } from './../../cms/core/form-elements';

@PageType({
    displayName: "Blog Page Type",
    componentRef: BlogComponent
})
export class Blog {

    @Property({
        displayName: "Title",
        displayType: Elements.Input
    })
    title: string;
    @Property({
        displayName: "This is content",
        displayType: Elements.Input
    })
    content: string;
}