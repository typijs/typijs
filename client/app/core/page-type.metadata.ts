import 'reflect-metadata';

export const PAGE_TYPES = Symbol("PAGE_TYPES");
export const PAGE_TYPE_ANNOTATIONS = Symbol("PAGE_TYPE_ANNOTATIONS");

export function specialDecorator(item: any) {
    item.isSpeciallyDecorated = true;
}

interface PageTypeMetadata {
    displayName?: string;
    component?: any;
}

export function PageType(metadata: PageTypeMetadata) {
    return function (ctor: Function) {
        specialDecorator(ctor);
        // add metadata to constructor
        Reflect.defineMetadata(PAGE_TYPE_ANNOTATIONS, metadata, ctor);
    }
}
