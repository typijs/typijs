import { PAGE_TYPE_INDICATOR } from './constants'; 

interface Ng2CmsModel {
    PAGE_TYPES: Array<any>;
}

const CMS: Ng2CmsModel = {
    PAGE_TYPES: []
};

export default CMS;

export function registerPageType(theEntryScope: any) {
    for (let prop in theEntryScope) {
        if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
            //console.log(`Is ${prop} decorated?  ${theEntryScope[prop]["isSpeciallyDecorated"]}!`);
            CMS.PAGE_TYPES.push(theEntryScope[prop]);
        }
    }
}