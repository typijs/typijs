import 'reflect-metadata';
import { Injectable } from '@angular/core';

import { CMS } from './../cms';
import {
    PROPERTIES_METADATA_KEY,
    PROPERTY_METADATA_KEY,
    PAGE_TYPE_METADATA_KEY,
    BLOCK_TYPE_METADATA_KEY,
    MEDIA_TYPE_METADATA_KEY
} from '../decorators/metadata-key';
import { ContentTypeMetadata } from '../decorators/content-type.decorator';
import { ContentTypeProperty, ContentType } from '../types/content-type';

@Injectable({
    providedIn: 'root'
})
export class ContentTypeService {

    /**
     * Gets content type properties
     * @param contentTypeTarget The class which be decorated by @PageType or @BlockType
     * @returns content type properties
     */
    getContentTypeProperties(contentTypeTarget: any): ContentTypeProperty[] {
        const properties: string[] = [];
        let target = contentTypeTarget;
        // walk up the property chain to get all base class fields
        while (target !== Object.prototype) {
            const childFields = Reflect.getOwnMetadata(PROPERTIES_METADATA_KEY, target) || [];
            properties.push(...childFields);
            target = Object.getPrototypeOf(target);
        }

        return properties.map(propertyName => ({
            name: propertyName,
            metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentTypeTarget, propertyName)
        }));
    }

    /**
     * Get all property metadata of a Page Type via page type name
     * @param pageTypeName The name of Page Type such as `HomePage`, `PortfolioPage`...
     * @returns page type properties
     */
    getPageTypeProperties(pageTypeName: string): ContentTypeProperty[] {
        const contentTypeTarget = CMS.PAGE_TYPES[pageTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${pageTypeName} has not registered yet`); }
        return this.getContentTypeProperties(contentTypeTarget);
    }

    /**
     * Gets page type property based on property name
     * @param pageTypeName
     * @param propertyName
     * @returns page type property
     */
    getPageTypeProperty(pageTypeName: string, propertyName: string): ContentTypeProperty {
        const contentTypeTarget = CMS.PAGE_TYPES[pageTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${pageTypeName} has not registered yet`); }
        return { name: propertyName, metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentTypeTarget, propertyName) };
    }

    /**
     * Get all property metadata of a Block Type via page type name
     * @param blockTypeName The name of Block Type such as `FeatureBlock`, `PortfolioBlock`...
     * @returns Return the array of ContentTypeProperty object
     */
    getBlockTypeProperties(blockTypeName: string): ContentTypeProperty[] {
        const contentTypeTarget = CMS.BLOCK_TYPES[blockTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${blockTypeName} has not registered yet`); }

        return this.getContentTypeProperties(contentTypeTarget);
    }

    /**
     * Gets block type property based property name
     * @param blockTypeName
     * @param propertyName
     * @returns block type property
     */
    getBlockTypeProperty(blockTypeName: string, propertyName: string): ContentTypeProperty {
        const contentTypeTarget = CMS.BLOCK_TYPES[blockTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${blockTypeName} has not registered yet`); }

        return { name: propertyName, metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentTypeTarget, propertyName) };
    }

    /**
     *
     * Get information of a Page Type
     * @param pageTypeName The name of Page Type such as `HomePage`, `PortfolioPage`...
     * @returns page type
     */
    getPageType(pageTypeName: string): ContentType {
        const contentTypeTarget = CMS.PAGE_TYPES[pageTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${pageTypeName} has not registered yet`); }

        const pageMetadata: ContentTypeMetadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, contentTypeTarget);
        return {
            name: pageTypeName,
            metadata: pageMetadata,
            properties: this.getContentTypeProperties(contentTypeTarget)
        } as ContentType;
    }

    /**
     * Gets block type information
     * @param blockTypeName The name of Block Type such as `FeatureBlock`, `PortfolioBlock`...
     * @returns block type with type of `ContentType`
     */
    getBlockType(blockTypeName: string): ContentType {
        const contentTypeTarget = CMS.BLOCK_TYPES[blockTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${blockTypeName} has not registered yet`); }

        const pageMetadata: ContentTypeMetadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, contentTypeTarget);
        return {
            name: blockTypeName,
            metadata: pageMetadata,
            properties: this.getContentTypeProperties(contentTypeTarget)
        } as ContentType;
    }

    /**
     * Gets media type information
     * @param mediaTypeName mediaTypeName
     * @returns Return the Media Type with type of `ContentType`
     */
    getMediaType(mediaTypeName: string): ContentType {
        const contentTypeTarget = CMS.MEDIA_TYPES[mediaTypeName];
        if (!contentTypeTarget) { throw new Error(`The ${mediaTypeName} has not registered yet`); }

        const pageMetadata: ContentTypeMetadata = Reflect.getMetadata(MEDIA_TYPE_METADATA_KEY, contentTypeTarget);
        return {
            name: mediaTypeName,
            metadata: pageMetadata,
            properties: this.getContentTypeProperties(contentTypeTarget)
        } as ContentType;
    }

    /**
     * Gets all page types
     * @returns all page types
     */
    getAllPageTypes(): ContentType[] {
        return Object.keys(CMS.PAGE_TYPES).map(contentTypeName => this.getPageType(contentTypeName));
    }

    /**
     * Gets all block types
     * @returns all block types
     */
    getAllBlockTypes(): ContentType[] {
        return Object.keys(CMS.BLOCK_TYPES).map(contentTypeName => this.getBlockType(contentTypeName));
    }

    /**
     * Gets all media types
     * @returns all media types
     */
    getAllMediaTypes(): ContentType[] {
        return Object.keys(CMS.MEDIA_TYPES).map(contentTypeName => this.getMediaType(contentTypeName));
    }
}
