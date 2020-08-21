import { Page } from './page.model';
import { Block } from './block.model';

export abstract class ContentData {
    id: string;
    parentId?: string;
    contentType: string;
    name: string;
    type: 'page' | 'block';
}

export class BlockData extends ContentData {
    constructor(block: Partial<Block>) {
        super();
        const blockData = {
            ...block.properties,
            id: block._id,
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
            linkUrl: page.publishedLinkUrl,
            parentId: page.parentId,
            urlSegment: page.urlSegment,
            contentType: page.contentType,
            name: page.name,
            type: 'page'
        };

        Object.assign(this, pageData);
    }
}
