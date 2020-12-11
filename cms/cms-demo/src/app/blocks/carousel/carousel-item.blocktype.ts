import { BlockData, BlockType, CmsImage, Property, UIHint } from '@angular-cms/core';
import { CarouselItemComponent } from './carousel-item.component';

@BlockType({
    displayName: 'Carousel Item Block',
    componentRef: CarouselItemComponent
})
export class CarouselItemBlock extends BlockData {
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
        displayName: 'Image',
        displayType: UIHint.Image
    })
    image: CmsImage;

    @Property({
        displayName: 'Button Text',
        displayType: UIHint.Text
    })
    buttonText: string;
}
