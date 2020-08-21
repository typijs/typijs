export type CmsPropertyUIType = {
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
    Image: string;
    Url: string;
    UrlList: string;
    InputList: string;
    Datepicker: string;
    Timepicker: string;
    [key: string]: string;
};

// build-in property types
// tslint:disable-next-line: variable-name
export const UIHint: CmsPropertyUIType = {
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
    Image: 'Image',
    Url: 'Url',
    UrlList: 'UrlList',
    InputList: 'InputList',
    Datepicker: 'Datepicker',
    Timepicker: 'Timepicker'
};
