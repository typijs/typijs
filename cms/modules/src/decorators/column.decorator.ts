import 'reflect-metadata';
import { Validators } from '@angular/forms';

import { COLUMNS_METADATA_KEY, COLUMN_METADATA_KEY } from './metadata-key';

export type ValidateMetadata = {
    validateFn: Function;
    message?: string
};

export type ColumnMetadata = {
    displayName?: string;
    description?: string;
    displayType?: string;
    selectionFactory?: any;
    objectListItemType?: any,
    order?: number;
    groupName?: string;
    validates?: ValidateMetadata[];
    allowedTypes?: string[];
    // be only used as private property for internal methods
    _propertyType?: string
    [key: string]: any;
};

/**
 * The property decorator factory
 *
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 *
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata
 */
export function Column(metadata: ColumnMetadata) {
    function columnDecorator(target: object, propertyKey: string) {
        const columns: string[] = Reflect.getMetadata(COLUMNS_METADATA_KEY, target.constructor) || [];
        if (columns.indexOf(propertyKey) == -1) { columns.push(propertyKey); }
        Reflect.defineMetadata(COLUMNS_METADATA_KEY, columns, target.constructor);

        // Obtaining type metadata using the reflect metadata API
        const propertyTypeMetadata = Reflect.getMetadata('design:type', target, propertyKey);
        if (propertyTypeMetadata) { Object.assign(metadata, { _propertyType: propertyTypeMetadata.name }); }

        return Reflect.defineMetadata(COLUMN_METADATA_KEY, metadata, target.constructor, propertyKey);
    }

    return columnDecorator;
}

export class ValidationTypes {
    static required(message?: string): ValidateMetadata {
        return { validateFn: Validators.required, message };
    }

    static minLength(value: number, message?: string): ValidateMetadata {
        return { validateFn: Validators.minLength(value), message };
    }

    static maxLength(value: number, message?: string): ValidateMetadata {
        return { validateFn: Validators.maxLength(value), message };
    }
}
