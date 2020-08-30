import 'reflect-metadata';
import { Property, PropertyMetadata } from '@angular-cms/core';



export interface ColumnMetadata extends PropertyMetadata {
    sort?: boolean;
    editable?: boolean;
}

/**
 * The column decorator factory
 *
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 *
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata
 */
export function Column(metadata: ColumnMetadata): PropertyDecorator {
    return Property(metadata);
}
