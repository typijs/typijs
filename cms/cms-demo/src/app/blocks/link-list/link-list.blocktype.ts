import { BlockData, BlockType, Property, ValidationTypes, UIHint, CmsUrl } from '@typijs/core';
import { LinkListComponent } from './link-list.component';

@BlockType({
    displayName: 'Link List Block',
    componentRef: LinkListComponent,
    description: 'This is Link list block type'
})
export class LinkListBlock extends BlockData {
    @Property({
        displayName: 'Header',
        displayType: UIHint.Text,
        validates: [ValidationTypes.required('This field is required')]
    })
    header: string;

    @Property({
        displayName: 'Link Items',
        displayType: UIHint.UrlList
    })
    linkItems: CmsUrl[];
}
