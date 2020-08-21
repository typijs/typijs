import { BlockData, BlockType, Property, ValidationTypes, UIHint, CmsImage } from '@angular-cms/core';
import { FeatureComponent } from './feature.component';

@BlockType({
    displayName: 'Feature Block',
    componentRef: FeatureComponent,
    description: 'This is feature block type'
})
export class FeatureBlock extends BlockData {
    @Property({
        displayName: 'Header',
        displayType: UIHint.Text,
        validates: [ValidationTypes.required('This field is required')]
    })
    header: string;

    @Property({
        displayName: 'Summary',
        displayType: UIHint.XHtml
    })
    summary: string;

    @Property({
        displayName: 'Image Teaser',
        displayType: UIHint.Image
    })
    image: CmsImage;

    @Property({
        displayName: 'Read More Link',
        displayType: UIHint.Text
    })
    link: string;
}
