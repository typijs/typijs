import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants';

interface Ng2CmsModel {
    PAGE_TYPES: object;
    BLOCK_TYPES: object;
    EDITOR_ROUTES: any;
    modules: any;
}

export const CMS: Ng2CmsModel = {
    PAGE_TYPES: {},
    BLOCK_TYPES: {},
    EDITOR_ROUTES: [],
    modules: []
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