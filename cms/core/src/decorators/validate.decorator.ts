import "reflect-metadata";
import { VALIDATION_METADATA_KEY } from './../constants';

interface ValidateMetadata {
    require?: boolean;
    length?: any;
    min?: number;
    max?: [string, number];
    email?: boolean;
}

export function Validate(metadata: ValidateMetadata) {
    return function (target: object, propertyKey: string) {
        return Reflect.defineMetadata(VALIDATION_METADATA_KEY, metadata, target.constructor, propertyKey);
    }
}
