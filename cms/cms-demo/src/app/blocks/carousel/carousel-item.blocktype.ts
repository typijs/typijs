import { BlockData, BlockType, CmsImage, Property, UIHint, CmsUrl } from '@typijs/core';
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
        displayType: UIHint.Textarea
    })
    subheading: string;

    @Property({
        displayName: 'Image',
        displayType: UIHint.Image
    })
    image: CmsImage;

    @Property({
        displayName: 'Link Url',
        displayType: UIHint.Url
    })
    url: CmsUrl;
}
