export type CmsPropertyType = {
    Input: string;
    Textarea: string;
    Select: string;
    PropertyList: string;
    Xhtml: string;
    Checkbox: string;
    ContentArea: string;
    ContentReference: string;
}

//build-in property types
export const UIHint: CmsPropertyType = {
    Input: "Input",
    Textarea: "Textarea",
    Select: "Select",
    PropertyList: "PropertyList",
    Xhtml: "Xhtml",
    Checkbox: "Checkbox",
    ContentArea: "ContentArea",
    ContentReference: "ContentReference"
};