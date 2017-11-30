import "reflect-metadata";

const formatMetadataKey = Symbol("format");

interface PropertyMetadata {
    displayName?: string;
    required?: boolean;
    order?: number;
    formDisplayType: any;
  }

function format(formatString: string) {
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}