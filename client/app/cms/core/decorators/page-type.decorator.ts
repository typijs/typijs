import 'reflect-metadata';
import { PAGE_TYPE_METADATA_KEY, PAGE_TYPE_INDICATOR } from './../constants';

function specialDecorator(item: any) {
    item[PAGE_TYPE_INDICATOR] = true;
}

interface PageTypeMetadata {
    displayName?: string;
    description?: string;
    componentRef?: any;
}

export function PageType(metadata: PageTypeMetadata) {
    return function (ctor: Function) {
        specialDecorator(ctor);
        Reflect.defineMetadata(PAGE_TYPE_METADATA_KEY, metadata, ctor);
    }
}
