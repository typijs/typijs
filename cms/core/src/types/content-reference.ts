import { TypeOfContent } from './index';

/**
 * Contains information to reference `ContentData` instance
 */
export class ContentReference {

    constructor(contentRef: Partial<ContentReference>) {
        Object.assign(this, contentRef);
    }
    /**
     * The id of content
     */
    id: string;
    /**
     * The type of content: 'page' | 'block' | 'media' | 'folder_block' | 'folder_media'
     */
    type: TypeOfContent;
    /**
     * The content type
     */
    contentType: string;
    /**
     * The version id of content
     */
    versionId?: string;
    [propName: string]: any;

    static readonly EmptyReference: ContentReference = {
        id: '0',
        versionId: '0',
        type: '',
        contentType: ''
    };
}
