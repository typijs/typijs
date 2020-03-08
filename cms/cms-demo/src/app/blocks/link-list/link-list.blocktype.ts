import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@angular-cms/core';
import { LinkListComponent } from './link-list.component';
import { LinkItem } from '../../shared/link-item';

@BlockType({
    displayName: "Link List Block",
    componentRef: LinkListComponent,
    description: "This is Link list block type"
})
export class LinkListBlock extends BlockData {
    @Property({
        displayName: "Header",
        displayType: UIHint.Text,
        validates: [ValidationTypes.required("This field is required")]
    })
    header: string;

    @Property({
        displayName: "Link Items",
        displayType: UIHint.ObjectList,
        objectListItemType: LinkItem,
    })
    linkItems: Array<LinkItem>
}