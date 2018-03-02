export class Page {
    _id?: string;
    name?: string;
    urlSegment?: string;
    linkUrl?: string;

    contentType?: string;
    parentId?: string;
    parentPath?: string;
    ancestors: Array<string>;
    hasChildren: boolean;

    isPublished: boolean;
    isDeleted: boolean;

    isVisibleOnSite: boolean;
    sortIndex: number;
    childrenSortCriteria: string;

    childItems: Array<any>;
    properties?: object;
}
