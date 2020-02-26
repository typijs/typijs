import { Injectable } from '@angular/core';
import { BlogComponent } from './blog.component';

import { Property, PageType, UIHint, ValidationTypes, PageData } from '@angular-cms/core';

import { BlogTypeSelectionFactory } from './blog-type-selection.factory';
import { BannerItem } from './banner-item';

@PageType({
    displayName: "Blog Page Type",
    componentRef: BlogComponent,
    description: "This is blog page type"
})
export class Blog extends PageData {

    @Property({
        displayName: "Title",
        displayType: "Tag",
        validates: [
            ValidationTypes.required("This is min required"),
            ValidationTypes.minLength(1, "This is min message"),
            ValidationTypes.maxLength(10, "This is max message")]
    })
    title: string;

    @Property({
        displayName: "This is content",
        displayType: UIHint.Textarea,
        groupName: 'Site Setting',
        validates: [ValidationTypes.required("This is min required")]
    })
    content: string;

    @Property({
        displayName: "This is summary",
        groupName: 'Site Setting',
        displayType: UIHint.Xhtml
    })
    summary: string;

    @Property({
        displayName: "This is header",
        displayType: UIHint.Xhtml
    })
    header: string;

    @Property({
        displayName: "This is blog type",
        displayType: UIHint.Select,
        selectionFactory: BlogTypeSelectionFactory
    })
    blogType: string;

    @Property({
        displayName: "This is check type",
        displayType: UIHint.Checkbox,
        selectionFactory: BlogTypeSelectionFactory
    })
    checkType: string;

    @Property({
        displayName: "This is banner",
        displayType: UIHint.PropertyList,
        propertyListItemType: BannerItem,
    })
    banners: Array<BannerItem>
}