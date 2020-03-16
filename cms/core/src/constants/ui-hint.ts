export type CmsPropertyType = {
    Text: string;
    Number: string;
    Textarea: string;
    Dropdown: string;
    AutoSuggestion: string;
    ObjectList: string;
    XHtml: string;
    Checkbox: string;
    RadioButtons: string;
    ContentArea: string;
    ContentReference: string;
    Url: string;
    UrlList: string;
    InputList: string;
    Datepicker: string;
    [key: string]: string;
}

//build-in property types
export const UIHint: CmsPropertyType = {
    Text: 'Text',
    Number: 'Number',
    Textarea: 'Textarea',
    Dropdown: 'Dropdown',
    AutoSuggestion: 'AutoSuggestion',
    ObjectList: 'ObjectList',
    XHtml: 'XHtml',
    Checkbox: 'Checkbox',
    RadioButtons: 'RadioButtons',
    ContentArea: 'ContentArea',
    ContentReference: 'ContentReference',
    Url: 'Url',
    UrlList: 'UrlList',
    InputList: 'InputList',
    Datepicker: 'Datepicker',
    Timepicker: 'Timepicker'
};