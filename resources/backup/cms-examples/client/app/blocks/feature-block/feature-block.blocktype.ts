import { Injectable } from '@angular/core';

import { Property, BlockType, UIHint, ValidationTypes, ContentData } from '@angular-cms/core';
import { FeatureBlockComponent } from './feature-block.component';


@BlockType({
    displayName: "Feature Block",
    componentRef: FeatureBlockComponent,
    description: "Feature Block"
})
export class FeatureBlock extends ContentData {

    @Property({
        displayName: "Title",
        displayType: UIHint.Input,
        validates: [ValidationTypes.required("This is min required")]
    })
    title: string;

    @Property({
        displayName: "Summary",
        displayType: UIHint.Xhtml
    })
    summary: string;
    
    @Property({
        displayName: "Link Text",
        displayType: UIHint.Input,
        validates: [ValidationTypes.required("This is min required")]
    })
    linkText: string;
}