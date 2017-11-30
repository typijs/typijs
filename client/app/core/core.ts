let PAGES: Array<any> = [];
export default PAGES;

export function scanScope(theScope: any) {
    for (let prop in theScope) {
        if (theScope[prop]["isSpeciallyDecorated"]) {
            console.log(`Is ${prop} decorated?  ${theScope[prop]["isSpeciallyDecorated"]}!`);
            PAGES.push(theScope[prop]);
        } else {
            console.log(`${prop} is not specially decorated.  :-(`);
        }
    }
}