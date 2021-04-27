import 'reflect-metadata';

export const COLUMN_METADATA_KEY = Symbol('COLUMN_METADATA_KEY');
export const COLUMNS_METADATA_KEY = Symbol('COLUMNS_METADATA_KEY');

export interface ColumnMetadata {
    /**
     * The table column header
     */
    header?: string;
    /**
     * Allow sorting the column
     */
    sortable?: boolean;
    /**
     * The order of column
     */
    order?: number;
}

/**
 * The column decorator factory
 *
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 *
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata
 */
export function Column(metadata?: ColumnMetadata): PropertyDecorator {
    function propertyDecorator(target: object, propertyKey: string) {
        const properties: string[] = Reflect.getOwnMetadata(COLUMNS_METADATA_KEY, target.constructor) || [];
        if (properties.indexOf(propertyKey) === -1) { properties.push(propertyKey); }
        Reflect.defineMetadata(COLUMNS_METADATA_KEY, properties, target.constructor);


        return Reflect.defineMetadata(COLUMN_METADATA_KEY, metadata, target.constructor, propertyKey);
    }
    return propertyDecorator;
}

