import { String } from '../../elements/string/string.type';
import { PageType } from '../../core/page-type.metadata';
import { BlogComponent } from './blog.component';

@PageType({
    displayName: "Blog Page Type",
    component: BlogComponent
})
export class Blog {
    title: String;
    content: String;
}