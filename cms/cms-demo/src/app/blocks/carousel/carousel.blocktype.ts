import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@typijs/core';
import { CarouselComponent } from './carousel.component';
@BlockType({
    displayName: 'Carousel Block',
    componentRef: CarouselComponent
})
export class CarouselBlock extends BlockData {
    @Property({
        displayName: 'Carousel Items',
        displayType: UIHint.ContentArea,
        allowedTypes: ['CarouselItemBlock']
    })
    carouselItems: any[];
}
