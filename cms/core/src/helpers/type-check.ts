/**
 * Credits: https://github.com/bevry/typechecker
 */
export class TypeCheck {
    /** Get the object type string */
    static getObjectType(value: any): string {
        return Object.prototype.toString.call(value)
    }

    /** Checks to see if a value is an object */
    static isObject(value: any): boolean {
        // null is object, hence the extra check
        return value !== null && typeof value === 'object'
    }

    /** Checks to see if a value is a number */
    static isNumber(value?: any): boolean {
        return typeof value === 'number' || TypeCheck.getObjectType(value) === '[object Number]'
    }

    /** Checks to see if a value is a string */
    static isString(value?: any): boolean {
        return typeof value === 'string' || TypeCheck.getObjectType(value) === '[object String]'
    }

    /** Checks to see if a valule is a boolean */
    static isBoolean(value?: any): boolean {
        return (
            value === true ||
            value === false ||
            TypeCheck.getObjectType(value) === '[object Boolean]'
        )
    }

    /** Checks to see if a value is an array */
    static isArray(value?: any): boolean {
        return (
            (typeof Array.isArray === 'function' && Array.isArray(value)) ||
            TypeCheck.getObjectType(value) === '[object Array]'
        )
    }

    /** Checks to see if a value is a date */
    static isDate(value?: any): boolean {
        return TypeCheck.getObjectType(value) === '[object Date]'
    }
}
