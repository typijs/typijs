export interface IPageVersion {
    originPageId: any;

    name: string;
    urlSegment: string;
    linkUrl: string;

    contentType: string;
    parentId: string;

    childItems: any[];

    isLastPublished: boolean;
    isPageDeleted: boolean;

    isVisibleOnSite: boolean;
    properties: any;

    published: Date;
    publishedBy: any;
}

