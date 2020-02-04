import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@angular-cms/core';
import { FeatureComponent } from './feature.component';

@BlockType({
    displayName: "Feature Block",
    componentRef: FeatureComponent,
    description: "This is feature block type"
})
export class FeatureBlock extends BlockData {
    @Property({
        displayName: "Header",
        displayType: UIHint.Input,
        validates: [ValidationTypes.required("This field is required")]
    })
    header: string;

    @Property({
        displayName: "Summary",
        displayType: UIHint.Xhtml
    })
    summary: string;

    @Property({
        displayName: "Image Teaser",
        displayType: UIHint.Input
    })
    image: string;

    @Property({
        displayName: "Read More Link",
        displayType: UIHint.Input
    })
    link: string;
}