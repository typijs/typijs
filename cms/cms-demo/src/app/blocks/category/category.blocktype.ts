import { BlockData, BlockType, CmsImage, Property, UIHint, CmsUrl } from '@angular-cms/core';
import { CategoryComponent } from './category.component';

@BlockType({
    displayName: 'Category Block',
    groupName: 'Category',
    componentRef: CategoryComponent
})
export class CategoryBlock extends BlockData {

    @Property({
        displayName: 'Container Class',
        displayType: UIHint.Text
    })
    classes: string;

    @Property({
        displayName: 'Link',
        displayType: UIHint.Url
    })
    link: CmsUrl;

    @Property({
        displayName: 'Image',
        displayType: UIHint.Image
    })
    image: CmsImage;
}
