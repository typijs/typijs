import { Property, ValidationTypes, UIType } from "@angular-cms/core";

export class LinkItem {
    @Property({
        displayName: "Link Text",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("Link text is required")]
    })
    linkText: string;

    @Property({
        displayName: "Link Url",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("Link url is required")]
    })
    linkUrl: string;
}