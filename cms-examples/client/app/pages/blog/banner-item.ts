import { Property, ValidationTypes, UIHint } from "@angular-cms/core";
import { BlogTypeSelectionFactory } from "./blog-type-selection.factory";

export class BannerItem {
    @Property({
        displayName: "Title",
        displayType: UIHint.Input,
        validates: [
            ValidationTypes.required("This is min required"),
            ValidationTypes.minLength(1, "This is min message"),
            ValidationTypes.maxLength(10, "This is max message")]
    })
    title: string;

    @Property({
        displayName: "This is content",
        displayType: UIHint.Textarea,
        validates: [ValidationTypes.required("This is min required")]
    })
    content: string;

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
}