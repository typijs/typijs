import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants';
import { CmsProperty } from './bases/cms-property';

interface CmsModel {
    PAGE_TYPES: object;
    BLOCK_TYPES: object;
    PROPERTIES: object;
    EDITOR_ROUTES: any;
    modules: any;
}

export const CMS: CmsModel = {
    PAGE_TYPES: {},
    BLOCK_TYPES: {},
    PROPERTIES: [],
    EDITOR_ROUTES: [],
    modules: []
};

//register multi content types with cms
export function registerContentTypes(theEntryScope: any) {
    for (let prop in theEntryScope) {
        if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
            CMS.PAGE_TYPES[prop] = theEntryScope[prop];
        }

        if (theEntryScope[prop][BLOCK_TYPE_INDICATOR]) {
            CMS.BLOCK_TYPES[prop] = theEntryScope[prop];
        }
    }
}

//register one property
export function registerProperty(property: any) {
    if (property) {
        CMS.PROPERTIES[property['name']] = property;
    }
}