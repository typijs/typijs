export class Block {
    _id?: string;
    name?: string;

    contentType?: string;
    parentId?: string;
    parentPath?: string;
    hasChildren?: boolean;

    isPublished?: boolean;
    isDeleted?: boolean;

    childItems?: Array<any>;
    properties?: object;
}
