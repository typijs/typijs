export class Media {
    _id?: string;
    name?: string;

    mimeType?: string;
    size?: string;

    parentId?: string;
    parentPath?: string;
    hasChildren?: boolean;

    isPublished?: boolean;
    isDeleted?: boolean;

    childItems?: Array<any>;
}
