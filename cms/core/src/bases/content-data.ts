import { Page } from '../models/page.model';
import { Block } from '../models/block.model';

export abstract class ContentData {
    public id: string;
    public parentId?: string;
    public contentType: string;
    public name: string;
    public type: 'page' | 'block';
}

export class BlockData extends ContentData {
    constructor(block: Partial<Block>) {
        super();
        const blockData = Object.assign(<BlockData>{
            id: block._id,
            parentId: block.parentId,
            contentType: block.contentType,
            name: block.name,
            type: 'block'
        }, block.properties);

        Object.assign(this, blockData);
    }
}

export class PageData extends ContentData {
    public linkUrl: string;
    public urlSegment: string;

    constructor(page: Partial<Page>) {
        super();
        const pageData = Object.assign(<PageData>{
            id: page._id,
            linkUrl: page.publishedLinkUrl,
            parentId: page.parentId,
            urlSegment: page.urlSegment,
            contentType: page.contentType,
            name: page.name,
            type: 'page'
        }, page.properties);

        Object.assign(this, pageData);
    }
}