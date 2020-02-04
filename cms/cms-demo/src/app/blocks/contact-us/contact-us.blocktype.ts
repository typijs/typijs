import { BlockType } from '@angular-cms/core';
import { ContactUsComponent } from './contact-us.component';
import { LinkListBlock } from '../link-list/link-list.blocktype';

@BlockType({
    displayName: "Link List Block",
    componentRef: ContactUsComponent,
    description: "This is Link list block type"
})
export class ContactUsBlock extends LinkListBlock {

}