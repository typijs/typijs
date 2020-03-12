import 'reflect-metadata';
import { PAGE_TYPE_METADATA_KEY, PAGE_TYPE_INDICATOR, BLOCK_TYPE_METADATA_KEY, BLOCK_TYPE_INDICATOR, MEDIA_TYPE_INDICATOR, MEDIA_TYPE_METADATA_KEY } from './metadata-key';

export type ContentTypeMetadata = {
    displayName?: string;
    description?: string;
    componentRef?: any;
}

function registerPageTypeDecorator(target: any) {
    target[PAGE_TYPE_INDICATOR] = true;
}

//https://www.laurivan.com/scan-decorated-classes-in-typescript/
export function PageType(metadata: ContentTypeMetadata) {
    return function (target: Function) {
        registerPageTypeDecorator(target);
        Reflect.defineMetadata(PAGE_TYPE_METADATA_KEY, metadata, target);
    }
}

function registerBlockTypeDecorator(target: any) {
    target[BLOCK_TYPE_INDICATOR] = true;
}

export function BlockType(metadata: ContentTypeMetadata) {
    return function (target: Function) {
        registerBlockTypeDecorator(target);
        Reflect.defineMetadata(BLOCK_TYPE_METADATA_KEY, metadata, target);
    }
}

function registerMediaTypeDecorator(target: any) {
    target[MEDIA_TYPE_INDICATOR] = true;
}

export function MediaType(metadata: ContentTypeMetadata) {
    return function (target: Function) {
        registerMediaTypeDecorator(target);
        Reflect.defineMetadata(MEDIA_TYPE_METADATA_KEY, metadata, target);
    }
}
