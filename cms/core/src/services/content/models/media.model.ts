import { Content } from './content.model';

export interface Media extends Content {
    urlSegment: string;
    linkUrl: string;
    thumbnail: string;

    mimeType: string;
    size: number;
    cloudId: string;
    deleteHash: string;
}
