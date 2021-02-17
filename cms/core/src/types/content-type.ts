import { ContentTypeMetadata, PageTypeMetadata } from '../decorators/content-type.decorator';
import { PropertyMetadata } from '../decorators/property.decorator';

/**
 * The class contains the property information of a content type
 */
export interface ContentTypeProperty {
    /**
     * The name of property in Content Type
     */
    name: string;
    /**
     * The metadata of property which be passed via @Property decorator
     */
    metadata: PropertyMetadata;
}

export type ContentType = {
    name: string
    metadata: ContentTypeMetadata & PageTypeMetadata
    properties: ContentTypeProperty[]
};

export type PropertyModel = {
    value: any
    property: ContentTypeProperty
};
