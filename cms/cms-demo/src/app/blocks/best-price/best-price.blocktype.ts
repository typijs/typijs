import { BlockData, BlockType, CmsImage, Property, UIHint } from '@angular-cms/core';
import { BestPriceComponent } from './best-price.component';

@BlockType({
    displayName: 'Best Price Block',
    componentRef: BestPriceComponent
})
export class BestPriceBlock extends BlockData {
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
        displayName: 'Description',
        displayType: UIHint.XHtml
    })
    description: string;

    @Property({
        displayName: 'Background Image',
        displayType: UIHint.Image
    })
    backgroundImage: CmsImage;

    @Property({
        displayName: 'The end date',
        description: 'The end date to finish counter',
        displayType: UIHint.Datepicker
    })
    endDate: string;
}
