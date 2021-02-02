import { ContentReference } from './content-reference';

/**
 * Contains information to reference `Cms Image` instance
 */
export interface CmsImage {
    src: string;
    alt: string;
    thumbnail: string;
}

/**
 * Contains information to reference `ImageReference` instance
 */
export class ImageReference extends ContentReference implements CmsImage {
    src: string;
    alt: string;
    thumbnail: string;
}
