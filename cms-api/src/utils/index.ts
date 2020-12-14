export * from './nameOf';
export * from './pick';
export * from './slugify';
export * from './groupBy';

/**
 * Indicates whether a specified string is null, empty, or consists only of white-space characters.
 * @param str
 * @returns Return `true` if string is null, empty, or consists only of white-space characters
 */
export function isNullOrWhiteSpace(str: string): boolean {
    return str === null || str.match(/^ *$/) !== null;
}