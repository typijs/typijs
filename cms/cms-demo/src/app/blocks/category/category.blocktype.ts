import { BlockData, BlockType, CmsImage, Property, UIHint } from '@angular-cms/core';
import { CategoryComponent } from './category.component';

@BlockType({
    displayName: 'Service Block',
    componentRef: CategoryComponent
})
export class CategoryBlock extends BlockData {
    @Property({
        displayName: 'Heading',
        displayType: UIHint.Text
    })
    heading: string;

    @Property({
        displayName: 'Link',
        displayType: UIHint.Text
    })
    link: string;

    @Property({
        displayName: 'Image',
        displayType: UIHint.Image
    })
    image: CmsImage;
}
