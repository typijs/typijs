import { BlockType } from '@angular-cms/core';
import { ContactUsComponent } from './contact-us.component';
import { LinkListBlock } from '../link-list/link-list.blocktype';

@BlockType({
    displayName: "Contact Us Block",
    componentRef: ContactUsComponent,
    description: "Contact Us Block"
})
export class ContactUsBlock extends LinkListBlock {

}