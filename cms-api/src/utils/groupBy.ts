
/**
 * Array group by method
 * 
 * Usage:
 * ```javascript
 * const people = [
    { name: 'Lee', age: 21 },
    { name: 'Ajay', age: 20 },
    { name: 'Jane', age: 20 }
];
 * const groupedPeople = groupBy(people, 'age');
 * console.log(groupedPeople);
 * ```
 * Output:
 * ```
 * { 
    20: [{ name: 'Ajay', age: 20 }, { name: 'Jane', age: 20 }],
    21: [ { name: 'Lee', age: 21 } ] 
 }
 * ```
 * 
 * @param objectArray 
 * @param property 
 */
export function groupBy<T>(objectArray: T[], property: string): { [key: string]: T[] } {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
}