export interface ChildItemRef {
    _id?: string;
    refPath: string;
    content: any;
}

export class Content {
    //mongoose id
    _id?: string;
    //Common
    name?: string;
    //IHierarchyContent
    parentId: string;
    parentPath: string;
    ancestors: string[];
    hasChildren: boolean;
    //IPublishableContent
    published: Date;
    publishedBy: any;

    isPublished: boolean;
    //IContentHasChildItems
    childItems: ChildItemRef[];
    publishedChildItems: ChildItemRef[];

    //IContent
    contentType: string;
    properties: any;

    isDirty: boolean;
}
