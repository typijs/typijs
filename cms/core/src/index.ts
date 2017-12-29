import { PAGE_TYPE_INDICATOR } from './constants'; 

interface Ng2CmsModel {
    PAGE_TYPES: object;
}

export const CMS: Ng2CmsModel = {
    PAGE_TYPES: {}
};

export function registerPageType(theEntryScope: any) {
    for (let prop in theEntryScope) {
        if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
            //console.log(`Is ${prop} decorated?  ${theEntryScope[prop]["isSpeciallyDecorated"]}!`);
            CMS.PAGE_TYPES[prop] = theEntryScope[prop];
        }
    }
}

export enum UIType {
    Input = "Input",
    Textarea = "Textarea",
    Select = "Select",
    PropertyList = "PropertyList",
    Xhtml = "Xhtml",
    Checkbox = "Checkbox"
}

export * from './directives';
export * from './constants';
export * from './decorators';
export * from './core.module';
export * from './services';
export * from './bases';
export * from './models';
export * from './render';
export * from './services';
export * from './util';

