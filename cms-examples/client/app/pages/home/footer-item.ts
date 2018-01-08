import { Property, ValidationTypes, UIType } from "@angular-cms/core";
import { LinkItem } from "./link-item";

export class FooterItem {
    @Property({
        displayName: "Header",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("The header is required")]
    })
    header: string;

    @Property({
        displayName: "Link Items",
        displayType: UIType.PropertyList,
        propertyListItemType: LinkItem,
    })
    linkItems: Array<LinkItem>
}