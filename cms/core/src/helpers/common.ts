import { CmsTab } from "../types";

export function sortTabByTitle(tabOne: CmsTab, tabTwo: CmsTab): number {
  const titleOne = tabOne.title ? tabOne.title.toUpperCase() : ''; // ignore upper and lowercase
  const titleTwo = tabTwo.title ? tabTwo.title.toUpperCase() : ''; // ignore upper and lowercase
  if (titleOne < titleTwo) {
    return -1;
  }
  if (titleOne > titleTwo) {
    return 1;
  }
  return 0;
}

export function generateUUID(): string {
  let d = new Date().getTime();//Timestamp
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;//random number between 0 and 16
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

export function clone(obj: any) {
  let copy: any;

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
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    return Object.assign({}, obj);
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function isUrlAbsolute(url: string): boolean {
  if(!url) return false;
  if (url.indexOf('//') === 0) { return true; } // URL is protocol-relative (= absolute)
  if (url.indexOf('://') === -1) { return false; } // URL has no protocol (= relative)
  if (url.indexOf('.') === -1) { return false; } // URL does not contain a dot, i.e. no TLD (= relative, possibly REST)
  if (url.indexOf('/') === -1) { return false; } // URL does not contain a single slash (= relative)
  if (url.indexOf(':') > url.indexOf('/')) { return false; } // The first colon comes after the first slash (= relative)
  if (url.indexOf('://') < url.indexOf('.')) { return true; } // Protocol is defined before first dot (= absolute)
  return false; // Anything else must be relative
}