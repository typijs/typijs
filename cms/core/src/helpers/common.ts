import { CmsTab } from "../constants/types";

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

export function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
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