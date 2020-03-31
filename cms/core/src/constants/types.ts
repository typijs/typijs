
import { Routes } from '@angular/router';
import { ContentTypeMetadata } from '../decorators/content-type.decorator';
import { PropertyMetadata } from '../decorators/property.decorator';

/**
 * Function.prototype
 */
export type ClassOf<T> = new (...args: any[]) => T;
/**
 * Object.prototype
 */
export type CmsObject = { [key: string]: any };

export type ContentType = {
    name: string
    metadata: ContentTypeMetadata
    properties: ContentTypeProperty[]
}

export type PropertyModel = {
    value: any
    property: ContentTypeProperty
}

/**
 * The class contains the property information of a content type
 */
export type ContentTypeProperty = {
    /**
     * The name of property in Content Type
     */
    name: string
    /**
     * The metadata of property which be passed via @Property decorator
     */
    metadata: PropertyMetadata
}

export enum CmsModuleRoot {
    Editor = "Editor",
    Admin = "Admin"
}

export enum CmsWidgetPosition {
    Top,
    Left,
    Right
}

export type CmsComponentConfig = {
    component: any,
    position: CmsWidgetPosition,
    group?: string
}

export type CmsRootConfig = {
    name: CmsModuleRoot,
    routes?: Routes,
    widgets?: CmsComponentConfig[]
}

export type CmsModuleConfig = {
    module: CmsObject,
    roots: Array<CmsRootConfig>,
}

export type CmsTab = {
    name: string,
    title: string
}

