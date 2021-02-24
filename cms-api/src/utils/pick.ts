/**
 * The function to take some properties from object
 * 
 * Usage:
 * ```
 * pick(request, ['params', 'query', 'body']);
 * ```
 * https://stackoverflow.com/questions/25553910/one-liner-to-take-some-properties-from-object-in-es-6
 * @param obj 
 * @param props 
 */
export const pick = (obj, props: string[]) => {
    if (!obj) return {};
    return Object.assign({}, ...props.filter(prop => obj.hasOwnProperty(prop)).map(prop => ({ [prop]: obj[prop] })));
}