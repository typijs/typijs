import { Injectable } from '@angular/core';

import { Property, BlockType, UIType, ValidationTypes, ContentData } from '@angular-cms/core';
import { FeatureBlockComponent } from './feature-block.component';


@BlockType({
    displayName: "Feature Block",
    componentRef: FeatureBlockComponent,
    description: "Feature Block"
})
export class FeatureBlock extends ContentData {

    @Property({
        displayName: "Title",
        displayType: UIType.Input,
        validates: [ValidationTypes.required("This is min required")]
    })
    title: string;

    @Property({
        displayName: "Summary",
        displayType: UIType.Xhtml
    })
    summary: string;
    
    @Property({
        displayName: "Link Text",
        displayType: UIType.Input,
        validates: [ValidationTypes.required("This is min required")]
    })
    linkText: string;
}