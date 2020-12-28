import { TypeOfContent, TypeOfContentEnum } from '../../../types';
import { ContentReference } from "../../../types/content-reference";
import { Block } from './block.model';
import { Page } from './page.model';

export abstract class ContentData {
    id: string;
    versionId: string;
    parentId?: string;

    isDeleted: boolean;
    status: number;
    language: string;

    contentType: string;
    contentLink: ContentReference;
    name: string;
    type: TypeOfContent;
}

export class BlockData extends ContentData {
    constructor(block: Partial<Block>) {
        super();
        const blockData: BlockData = {
            ...block.properties,
            id: block._id,
            versionId: block.versionId,
            parentId: block.parentId,
            isDeleted: block.isDeleted,
            status: block.status,
            language: block.language,
            contentType: block.contentType,
            contentLink: { id: block._id, versionId: block.versionId, type: TypeOfContentEnum.Block, contentType: block.contentType },
            name: block.name,
            type: TypeOfContentEnum.Block
        };

        Object.assign(this, blockData);
    }
}

export class PageData extends ContentData {
    linkUrl: string;
    urlSegment: string;

    constructor(page: Partial<Page>) {
        super();
        const pageData: PageData = {
            ...page.properties,
            id: page._id,
            versionId: page.versionId,
            linkUrl: page.linkUrl,
            parentId: page.parentId,
            isDeleted: page.isDeleted,
            status: page.status,
            language: page.language,
            urlSegment: page.urlSegment,
            contentType: page.contentType,
            contentLink: { id: page._id, versionId: page.versionId, type: TypeOfContentEnum.Page, contentType: page.contentType },
            name: page.name,
            type: TypeOfContentEnum.Page
        };

        Object.assign(this, pageData);
    }
}
