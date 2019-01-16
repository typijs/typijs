import 'reflect-metadata';
import { BLOCK_TYPE_METADATA_KEY, BLOCK_TYPE_INDICATOR } from '../constants/meta-keys';
import { ContentTypeMetadata } from './content-type-metadata';

function registerBlockTypeDecorator(item: any) {
    item[BLOCK_TYPE_INDICATOR] = true;
}

export function BlockType(metadata: ContentTypeMetadata) {
    return function (ctor: Function) {
        registerBlockTypeDecorator(ctor);
        Reflect.defineMetadata(BLOCK_TYPE_METADATA_KEY, metadata, ctor);
    }
}
