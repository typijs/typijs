import 'reflect-metadata';
import {
    TABLE_METADATA_KEY,
    TABLE_INDICATOR,
} from './metadata-key';

export type TableMetadata = {
    displayName?: string;
    description?: string;
};

// https://www.laurivan.com/scan-decorated-classes-in-typescript/
/**
 * The PageType decorator factory
 *
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 *
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata
 */
export function Table(metadata: TableMetadata) {
    function tableDecorator(target: Function) {
        registerTableDecorator(target);
        Reflect.defineMetadata(TABLE_METADATA_KEY, metadata, target);
    }
    return tableDecorator;
}

function registerTableDecorator(target: any) {
    target[TABLE_INDICATOR] = true;
}

// https://stackoverflow.com/questions/55117125/typescript-decorators-reflect-metadata
// let obj = new C();
// let metadataValue = Reflect.getMetadata(metadataKey, obj, "method");
export function registerContentTypes(theEntryScope: any) {
    for (const prop in theEntryScope) {
        if (theEntryScope[prop][TABLE_INDICATOR]) {
            // CMS.PAGE_TYPES[prop] = theEntryScope[prop];
        }
    }
}
