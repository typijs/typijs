import "reflect-metadata";
import { PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY } from './../constants';

interface PropertyMetadata {
    displayName?: string;
    description?: string;
    displayType?: any;
    order?: number;
    groupName?: string;
}

export function Property(metadata: PropertyMetadata) {
    return function (target: object, propertyKey: string) {
        let properties: string[] = Reflect.getMetadata(PROPERTIES_METADATA_KEY, target.constructor) || [];
        properties.push(propertyKey);
        Reflect.defineMetadata(PROPERTIES_METADATA_KEY, properties, target.constructor);
        return Reflect.defineMetadata(PROPERTY_METADATA_KEY, metadata, target.constructor, propertyKey);
    }
}
