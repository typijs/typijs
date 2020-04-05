import { ContentTypeMetadata } from '../decorators/content-type.decorator'
import { PropertyMetadata } from '../decorators/property.decorator'

export type ContentType = {
    name: string
    metadata: ContentTypeMetadata
    properties: ContentTypeProperty[]
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

export type PropertyModel = {
    value: any
    property: ContentTypeProperty
}
