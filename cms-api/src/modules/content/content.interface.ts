interface IContent {
    created: Date;
    createdBy: any;
    changed: Date;
    changedBy: any;

    name: string;
    contentType: string;
    properties: any;

    parentId: string;
    parentPath: string;

    isContentDeleted: boolean;
    hasChildren: boolean;
}

export { IContent };