export * from './nameOf';
export * from './pick';
export * from './slugify';
export * from './groupBy';

/**
 * Indicates whether a specified string is `null`, `undefined`, empty, or consists only of white-space characters.
 * @param str
 * @returns Return `true` if string is null, empty, or consists only of white-space characters
 */
export function isNilOrWhiteSpace(str: string): boolean {
    return str === null || str === undefined || str.match(/^ *$/) !== null;
}

/**
 * Indicates whether a value is `null` or `undefined`
 * @param value
 * @returns Return `true` if object is `null` or `undefined`
 */
export function isNil(value): boolean {
    return value === null || value === undefined;
}