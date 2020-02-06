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
    childItems: any[];
    publishedChildItems: any[];

    //IContent
    contentType: string;
    properties: any;

    isDirty: boolean;
}
