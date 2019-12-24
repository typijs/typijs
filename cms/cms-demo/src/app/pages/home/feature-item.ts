import { Property, ValidationTypes, UIHint } from "@angular-cms/core";
import { LinkItem } from "./link-item";

export class FeatureItem {

    @Property({
        displayName: "Icon",
        displayType: UIHint.Input
    })
    icon: string;

    @Property({
        displayName: "Header",
        displayType: UIHint.Input,
        validates: [ValidationTypes.required("The header is required")]
    })
    header: string;

    @Property({
        displayName: "Summary",
        description: "This is summary for feature item",
        displayType: UIHint.Xhtml
    })
    summary: string;

    @Property({
        displayName: "Link Items",
        displayType: UIHint.PropertyList,
        propertyListItemType: LinkItem,
    })
    linkItems: Array<LinkItem>
}