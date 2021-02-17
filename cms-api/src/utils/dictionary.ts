//https://github.com/angular-vietnam/100-days-of-angular/blob/master/Day012-typescript-advanced-type.md

type ObjectDictionary<T> = { [key: string]: T };
type ArrayDictionary<T> = { [key: string]: T[] };

/**
 * Dictionary type
 * 
 * ```
 * let stringDic: Dictionary<string> // {[key: string]: string}
 * let numberArrayDictionary: Dictionary<number[]>; // {[key: string]: number[]}
 * let userEntity: Dictionary<User>; // {[key: string]: User}
 * ```
 */
export type Dictionary<T> = T extends [] ? ArrayDictionary<T[number]> : ObjectDictionary<T>;