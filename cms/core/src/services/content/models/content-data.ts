import { Page } from './page.model';
import { Block } from './block.model';

export abstract class ContentData {
    id: string;
    versionId: string;
    parentId?: string;
    contentType: string;
    name: string;
    type: 'page' | 'block' | 'media';
}

export class BlockData extends ContentData {
    constructor(block: Partial<Block>) {
        super();
        const blockData = {
            ...block.properties,
            id: block._id,
            versionId: block.versionId,
            parentId: block.parentId,
            contentType: block.contentType,
            name: block.name,
            type: 'block'
        };

        Object.assign(this, blockData);
    }
}

export class PageData extends ContentData {
    linkUrl: string;
    urlSegment: string;

    constructor(page: Partial<Page>) {
        super();
        const pageData = {
            ...page.properties,
            id: page._id,
            versionId: page.versionId,
            linkUrl: page.linkUrl,
            parentId: page.parentId,
            urlSegment: page.urlSegment,
            contentType: page.contentType,
            name: page.name,
            type: 'page'
        };

        Object.assign(this, pageData);
    }
}
