import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@angular-cms/core';
import { TestimonyComponent } from './testimony.component';

@BlockType({
    displayName: 'Testimony Block',
    groupName: 'Testimony',
    componentRef: TestimonyComponent
})
export class TestimonyBlock extends BlockData {
    @Property({
        displayName: 'Heading',
        displayType: UIHint.Text
    })
    heading: string;

    @Property({
        displayName: 'Subheading',
        displayType: UIHint.Text
    })
    subheading: string;

    @Property({
        displayName: 'Description',
        displayType: UIHint.XHtml
    })
    description: string;

    @Property({
        displayName: 'Testimony Items',
        displayType: UIHint.ContentArea,
        allowedTypes: ['TestimonyItemBlock']
    })
    testimonies: any[];
}
