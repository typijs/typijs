import "reflect-metadata";

export const PROPERTY_ANNOTATIONS = Symbol("PROPERTY_ANNOTATIONS");
export const PROPERTIES = Symbol("PROPERTIES");

interface PropertyMetadata {
    displayName?: string;
    required?: boolean;
    order?: number;
    formDisplayType?: any;
  }

export function Property(metadata: PropertyMetadata) {
    return function (target: object, propertyKey: string) {
        let columns: string[] = Reflect.getMetadata(PROPERTIES, target.constructor) || [];
        columns.push(propertyKey);
        Reflect.defineMetadata(PROPERTIES, columns, target.constructor);
        return Reflect.defineMetadata(PROPERTY_ANNOTATIONS, metadata, target.constructor, propertyKey);
    }
}
