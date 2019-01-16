import { CmsTab } from "../constants/module-config";

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

export function generateUUID() {
  // return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
  //   (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  // )
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function clone(obj) {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
          copy[i] = clone(obj[i]);
      }
      return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
      // copy = {};
      // for (var attr in obj) {
      //     if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      // }
      return Object.assign({}, obj);
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}