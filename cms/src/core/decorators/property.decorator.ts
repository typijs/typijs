import "reflect-metadata";
import { PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY } from './../constants';
import { UIType } from "../index";
import { Validators } from '@angular/forms';

interface ValidateMetadata{
    validateFn: Function;
    message?: string
}

interface PropertyMetadata {
    displayName?: string;
    description?: string;
    displayType?: UIType;
    selectionFactory?: any;
    propertyListItemType?: any,
    order?: number;
    groupName?: string;
    validates?: Array<ValidateMetadata>;
}

export function Property(metadata: PropertyMetadata) {
    return function (target: object, propertyKey: string) {
        let properties: string[] = Reflect.getMetadata(PROPERTIES_METADATA_KEY, target.constructor) || [];
        properties.push(propertyKey);
        Reflect.defineMetadata(PROPERTIES_METADATA_KEY, properties, target.constructor);
        return Reflect.defineMetadata(PROPERTY_METADATA_KEY, metadata, target.constructor, propertyKey);
    }
}

export class ValidationTypes {
    static required(message?: string): ValidateMetadata{
        return {validateFn: Validators.required, message}
    }

    static minLength(value: number, message?: string): ValidateMetadata{
        return {validateFn: Validators.minLength(value), message}
    }

    static maxLength(value: number, message?: string): ValidateMetadata{
        return {validateFn: Validators.maxLength(value), message}
    }
}
