import { BlockData, BlockType, CmsImage, Property, UIHint } from '@angular-cms/core';
import { VideoComponent } from './video.component';

@BlockType({
    displayName: 'Video Block',
    componentRef: VideoComponent
})
export class VideoBlock extends BlockData {
    @Property({
        displayName: 'Heading',
        displayType: UIHint.Text
    })
    heading: string;

    @Property({
        displayName: 'Description',
        displayType: UIHint.XHtml
    })
    description: string;

    @Property({
        displayName: 'Video Url',
        displayType: UIHint.Text
    })
    video: string;

    @Property({
        displayName: 'Video Thumbnail',
        displayType: UIHint.Image
    })
    thumbnail: CmsImage;

    @Property({
        displayName: 'Link Text',
        displayType: UIHint.Text
    })
    link: string;
}
