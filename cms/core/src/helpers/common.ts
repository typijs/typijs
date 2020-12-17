/**
 * Sort the array of object by string field
 * @param key the property name
 * @param order 'asc' | 'desc'
 */
export function sortByString(key: string, order: 'asc' | 'desc' = 'asc') {
    return function innerSort(a, b) {
        let varA: string;
        let varB: string;
        if (!a.hasOwnProperty(key)) {
            varA = '';
        } else {
            varA = a[key] ? a[key].toUpperCase() : '';
        }

        if (!b.hasOwnProperty(key)) {
            varB = '';
        } else {
            varB = b[key] ? b[key].toUpperCase() : '';
        }

        return comparison(varA, varB, order);
    };
}

/**
 * Sort the array of object by number field
 * @param key the property name
 * @param order 'asc' | 'desc'
 */
export function sortByNumber(key: string, order: 'asc' | 'desc' = 'asc') {
    return function innerSort(a, b) {
        let varA: number;
        let varB: number;
        if (!a.hasOwnProperty(key)) {
            varA = 0;
        } else {
            varA = a[key];
        }

        if (!b.hasOwnProperty(key)) {
            varB = 0;
        } else {
            varB = b[key];
        }

        return comparison(varA, varB, order);
    };
}

export function comparison(varA: string | number, varB: string | number, order: 'asc' | 'desc' = 'asc'): number {
    let comparison = 0;
    if (varA > varB) {
        comparison = 1;
    } else if (varA < varB) {
        comparison = -1;
    }
    return (
        (order === 'desc') ? (comparison * -1) : comparison
    );
}

export function generateUUID(): string {
    let d = new Date().getTime(); // Timestamp
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0; // Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16; // random number between 0 and 16
        if (d > 0) {// Use timestamp until depleted
            // tslint:disable-next-line: no-bitwise
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {// Use microseconds since page-load if supported
            // tslint:disable-next-line: no-bitwise
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        // tslint:disable-next-line: no-bitwise
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/**
 * Deep clone object
 * @param obj Source Object
 */
export function clone(obj: any) {
    let copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) { return obj; }

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
        return { ...obj };
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
}

/**
 * Check if the url is absolute
 * @param url
 */
export function isUrlAbsolute(url: string): boolean {
    if (!url) { return true; }
    if (url.indexOf('//') === 0) { return true; } // URL is protocol-relative (= absolute)
    if (url.indexOf('://') === -1) { return false; } // URL has no protocol (= relative)
    if (url.indexOf('.') === -1) { return false; } // URL does not contain a dot, i.e. no TLD (= relative, possibly REST)
    if (url.indexOf('/') === -1) { return false; } // URL does not contain a single slash (= relative)
    if (url.indexOf(':') > url.indexOf('/')) { return false; } // The first colon comes after the first slash (= relative)
    if (url.indexOf('://') < url.indexOf('.')) { return true; } // Protocol is defined before first dot (= absolute)
    return false; // Anything else must be relative
}

/**
 * Convert object to url query string format. It removes all empty, null or undefined params
 *
 * @param query the object such as `{param1: value1, param2: value2}`
 * @returns return url query string ex `param1=value1&param2=value2`
 */
export function convertObjectToUrlQueryString(query: { [param: string]: string | number }): string {
    for (const param in query) { /* You can get copy by spreading {...query} */

        if (query[param] === undefined /* In case of undefined assignment */
            || query[param] === null
            || query[param] === '') {

            delete query[param];
        }
    }

    return new URLSearchParams(query as any).toString();
}

/**
 * Indicates whether a specified string is null, empty, or consists only of white-space characters.
 * @param str
 * @returns
 */
export function isNullOrWhiteSpace(str: string): boolean {
    return str === null || str.match(/^ *$/) !== null;
}
