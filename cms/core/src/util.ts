import { CmsTab } from "./module-config";

export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function sortTabByTitle(tabOne: CmsTab, tabTwo: CmsTab) {
  var titleOne = tabOne.title ? tabOne.title.toUpperCase() : ''; // ignore upper and lowercase
  var titleTwo = tabTwo.title ? tabTwo.title.toUpperCase() : ''; // ignore upper and lowercase
  if (titleOne < titleTwo) {
    return -1;
  }
  if (titleOne > titleTwo) {
    return 1;
  }
  // names must be equal
  return 0;
}