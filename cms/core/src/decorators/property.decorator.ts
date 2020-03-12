import "reflect-metadata";
import { Validators } from '@angular/forms';

import { PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY } from './metadata-key';

export type ValidateMetadata = {
    validateFn: Function;
    message?: string
}

export type PropertyMetadata = {
    displayName?: string;
    description?: string;
    displayType?: string;
    selectionFactory?: any;
    objectListItemType?: any,
    order?: number;
    groupName?: string;
    validates?: Array<ValidateMetadata>;
    allowedTypes?: Array<string>;
    [key: string]: any;
    // be only used as private property for internal methods
    _propertyType?: string
}

export function Property(metadata: PropertyMetadata) {
    return function (target: object, propertyKey: string) {
        const properties: string[] = Reflect.getMetadata(PROPERTIES_METADATA_KEY, target.constructor) || [];
        if (properties.indexOf(propertyKey) == -1) properties.push(propertyKey);
        Reflect.defineMetadata(PROPERTIES_METADATA_KEY, properties, target.constructor);

        //Obtaining type metadata using the reflect metadata API

        // var propertyTypeMetadata = Reflect.getMetadata("design:type", target, propertyKey);
        // Object.assign(metadata, { _propertyType: propertyTypeMetadata.name })

        return Reflect.defineMetadata(PROPERTY_METADATA_KEY, metadata, target.constructor, propertyKey);
    }
}

export class ValidationTypes {
    static required(message?: string): ValidateMetadata {
        return { validateFn: Validators.required, message }
    }

    static minLength(value: number, message?: string): ValidateMetadata {
        return { validateFn: Validators.minLength(value), message }
    }

    static maxLength(value: number, message?: string): ValidateMetadata {
        return { validateFn: Validators.maxLength(value), message }
    }
}
