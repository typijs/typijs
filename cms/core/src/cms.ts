import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants';

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

//register a property with cms
export function registerProperty(property: any, uniqueAccessKey?: string) {
    if (property) {
        if (uniqueAccessKey) {
            if(CMS.PROPERTIES.hasOwnProperty(uniqueAccessKey)) {
                console.log('Warning: CMS.PROPERTIES has already property ', uniqueAccessKey)
            }
            CMS.PROPERTIES[uniqueAccessKey] = property
        } else {
            if(CMS.PROPERTIES.hasOwnProperty(property['name'])) {
                console.log('Warning: CMS.PROPERTIES has already property ', property['name'])
            }
            CMS.PROPERTIES[property['name']] = property;
        }
    }
}

//register multi properties with cms
export function registerProperties(properties: Array<[string, Function]> | Array<Function>) {
    if (properties instanceof Array) {
        for(const property of properties) {
            if(property instanceof Function) {
                registerProperty(property);
            } else if(property instanceof Array && property.length == 2) {
                registerProperty(property[1], property[0]);
            }
        }
    }
}