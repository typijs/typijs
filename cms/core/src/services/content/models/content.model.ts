export type ChildItemRef = {
    _id?: string;
    refPath: string;
    content: string | any;
};

export class Content {
    // mongoose id
    _id?: string;
    // Common
    name?: string;
    // IHierarchyContent
    parentId: string;
    parentPath: string;
    ancestors: string[];
    hasChildren: boolean;
    // IPublishableContent
    published: Date;
    publishedBy: any;

    isPublished: boolean;
    // IContentHasChildItems
    childItems: ChildItemRef[];
    publishedChildItems: ChildItemRef[];

    // IContent
    contentType: string;
    // contain all property's values which are defined as property (using decorator @Property) of content type
    // @key will be property name of content type
    properties: { [key: string]: any };

    isDirty: boolean;
    [propName: string]: any;
}
