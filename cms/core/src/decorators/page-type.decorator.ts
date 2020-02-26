import 'reflect-metadata';
import { PAGE_TYPE_METADATA_KEY, PAGE_TYPE_INDICATOR } from '../constants/meta-keys';
import { ContentTypeMetadata } from './content-type-metadata';

//https://www.laurivan.com/scan-decorated-classes-in-typescript/
function registerPageTypeDecorator(item: any) {
    item[PAGE_TYPE_INDICATOR] = true;
}

export function PageType(metadata: ContentTypeMetadata) {
    return function (ctor: Function) {
        registerPageTypeDecorator(ctor);
        Reflect.defineMetadata(PAGE_TYPE_METADATA_KEY, metadata, ctor);
    }
}
