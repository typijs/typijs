import { BlockData, BlockType, CmsImage, Property, UIHint } from '@typijs/core';
import { NewsletterComponent } from './newsletter.component';

@BlockType({
    displayName: 'Newsletter Block',
    componentRef: NewsletterComponent
})
export class NewsletterBlock extends BlockData {
    @Property({
        displayName: 'Heading',
        displayType: UIHint.Text
    })
    heading: string;

    @Property({
        displayName: 'Subheading',
        displayType: UIHint.Textarea
    })
    subheading: string;

    @Property({
        displayName: 'Button Text',
        displayType: UIHint.Text
    })
    buttonText: string;

    @Property({
        displayName: 'Placeholder Text',
        displayType: UIHint.Text
    })
    placeholder: string;
}
