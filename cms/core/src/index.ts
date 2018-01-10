import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants';

interface Ng2CmsModel {
    PAGE_TYPES: object;
    BLOCK_TYPES: object;
}

export const CMS: Ng2CmsModel = {
    PAGE_TYPES: {},
    BLOCK_TYPES: {}
};

export function registerContentType(theEntryScope: any) {
    for (let prop in theEntryScope) {
        if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
            CMS.PAGE_TYPES[prop] = theEntryScope[prop];
        }

        if (theEntryScope[prop][BLOCK_TYPE_INDICATOR]) {
            CMS.BLOCK_TYPES[prop] = theEntryScope[prop];
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

