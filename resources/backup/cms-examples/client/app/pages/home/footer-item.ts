import { Property, ValidationTypes, UIHint } from "@angular-cms/core";
import { LinkItem } from "./link-item";

export class FooterItem {
    @Property({
        displayName: "Header",
        displayType: UIHint.Input,
        validates: [
            ValidationTypes.required("The header is required")]
    })
    header: string;

    @Property({
        displayName: "Link Items",
        displayType: UIHint.PropertyList,
        propertyListItemType: LinkItem,
    })
    linkItems: Array<LinkItem>
}