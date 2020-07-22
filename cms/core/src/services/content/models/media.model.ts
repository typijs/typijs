import { Content } from './content.model';

export class Media extends Content {
    mimeType: string;
    size: number;
    thumbnail: string;
    link: string;
}
