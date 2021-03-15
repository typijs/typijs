import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@angular-cms/core';
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
