import { Property, ValidationTypes, UIType } from "@angular-cms/core";
import { BlogTypeSelectionFactory } from "./test.service";

export class BannerItem {
    @Property({
        displayName: "Title",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("This is min required"),
            ValidationTypes.minLength(1, "This is min message"),
            ValidationTypes.maxLength(10, "This is max message")]
    })
    title: string;

    @Property({
        displayName: "This is content",
        displayType: UIType.Textarea,
        validates: [ValidationTypes.required("This is min required")]
    })
    content: string;

    @Property({
        displayName: "This is header",
        displayType: UIType.Xhtml
    })
    header: string;

    @Property({
        displayName: "This is blog type",
        displayType: UIType.Select,
        selectionFactory: BlogTypeSelectionFactory
    })
    blogType: string;

    @Property({
        displayName: "This is check type",
        displayType: UIType.Checkbox,
        selectionFactory: BlogTypeSelectionFactory
    })
    checkType: string;
}


export class ImageItem {
    @Property({
        displayName: "Image Url",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("This is min required")]
    })
    url: string;

    @Property({
        displayName: "Thumbnail",
        displayType: UIType.Input,
        validates: [ValidationTypes.required("This is min required")]
    })
    thumb: string;

    @Property({
        displayName: "This is header",
        displayType: UIType.Xhtml
    })
    header: string;

    @Property({
        displayName: "This is blog type",
        displayType: UIType.Select,
        selectionFactory: BlogTypeSelectionFactory
    })
    blogType: string;

    @Property({
        displayName: "This is check type",
        displayType: UIType.Checkbox,
        selectionFactory: BlogTypeSelectionFactory
    })
    checkType: string;

    @Property({
        displayName: "This is banner",
        displayType: UIType.PropertyList,
        propertyListItemType: BannerItem,
    })
    banners: Array<BannerItem>
}