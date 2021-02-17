import { BlockData, BlockType, CmsImage, Property, UIHint } from '@angular-cms/core';
import { TestimonyItemComponent } from './testimony-item.component';

@BlockType({
    displayName: 'Testimony Item Block',
    groupName: 'Testimony',
    componentRef: TestimonyItemComponent
})
export class TestimonyItemBlock extends BlockData {

    @Property({
        displayName: 'Position',
        displayType: UIHint.Text
    })
    position: string;

    @Property({
        displayName: 'Avatar',
        displayType: UIHint.Image
    })
    avatar: CmsImage;

    @Property({
        displayName: 'Quote',
        displayType: UIHint.XHtml
    })
    quote: string;
}
