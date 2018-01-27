import { Property, ValidationTypes, UIHint } from "@angular-cms/core";

export class LinkItem {
    @Property({
        displayName: "Link Text",
        displayType: UIHint.Input,
        validates: [
            ValidationTypes.required("Link text is required")]
    })
    linkText: string;

    @Property({
        displayName: "Link Url",
        displayType: UIHint.Input,
        validates: [
            ValidationTypes.required("Link url is required")]
    })
    linkUrl: string;
}