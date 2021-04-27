import { BlockType, Property, UIHint } from '@typijs/core';
import { ContactUsComponent } from './contact-us.component';
import { LinkListBlock } from '../link-list/link-list.blocktype';

@BlockType({
    displayName: 'Contact Us Block',
    componentRef: ContactUsComponent,
    description: 'Contact Us Block'
})
export class ContactUsBlock extends LinkListBlock {
    @Property({
        displayName: 'Test Field',
        displayType: UIHint.Text
    })
    testField: string;
}

@BlockType({
    displayName: 'Contact Block 2',
    componentRef: ContactUsComponent,
    description: 'Contact Block 2'
})
export class ContactUsBlock2 extends LinkListBlock {
    @Property({
        displayName: 'Other Field',
        displayType: UIHint.Text
    })
    otherField: string;
}
