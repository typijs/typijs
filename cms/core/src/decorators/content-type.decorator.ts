import 'reflect-metadata';
import { BlockData, ContentData, PageData } from '../services/content/models/content-data';
import { ClassOf } from '../types';
import {
    BLOCK_TYPE_INDICATOR,
    BLOCK_TYPE_METADATA_KEY,
    MEDIA_TYPE_INDICATOR,
    MEDIA_TYPE_METADATA_KEY,
    PAGE_TYPE_INDICATOR,
    PAGE_TYPE_METADATA_KEY
} from './metadata-key';

export type ContentTypeMetadata = {
    displayName?: string;
    description?: string;
    componentRef?: any;
}

//https://www.laurivan.com/scan-decorated-classes-in-typescript/
/**
 * The PageType decorator factory
 * 
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 * 
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata 
 */
export function PageType(metadata: ContentTypeMetadata) {
    function pageTypeDecorator<T extends PageData>(target: ClassOf<T>) {
        registerPageTypeDecorator(target);
        Reflect.defineMetadata(PAGE_TYPE_METADATA_KEY, metadata, target);
    }
    return pageTypeDecorator;
}

function registerPageTypeDecorator(target: any) {
    target[PAGE_TYPE_INDICATOR] = true;
}

/**
 * The BlockType decorator factory
 * 
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 * 
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata
 */
export function BlockType(metadata: ContentTypeMetadata) {
    function blockTypeDecorator<T extends BlockData>(target: ClassOf<T>) {
        registerBlockTypeDecorator(target);
        Reflect.defineMetadata(BLOCK_TYPE_METADATA_KEY, metadata, target);
    }

    return blockTypeDecorator;
}

function registerBlockTypeDecorator(target: any) {
    target[BLOCK_TYPE_INDICATOR] = true;
}

/**
 * The MediaType decorator factory
 * 
 * The factory, is just a function that receives any parameters you want and returns a function with a decorator signature
 * 
 * https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 * @param metadata 
 */
export function MediaType(metadata: ContentTypeMetadata) {
    function mediaTypeDecorator<T extends ContentData>(target: ClassOf<T>) {
        registerMediaTypeDecorator(target);
        Reflect.defineMetadata(MEDIA_TYPE_METADATA_KEY, metadata, target);
    }

    return mediaTypeDecorator;
}

function registerMediaTypeDecorator(target: any) {
    target[MEDIA_TYPE_INDICATOR] = true;
}
