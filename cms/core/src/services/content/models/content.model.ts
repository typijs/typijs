import { BaseModel } from '../../base.model';

export type ChildItemRef = {
    _id?: string;
    refPath: string;
    content: string | any;
};

export interface Content extends BaseModel {
    // mongoose id
    _id: string;
    // IHierarchyContent
    parentId: string;
    parentPath: string;
    ancestors: string[];
    hasChildren: boolean;
    childOrderRule: number;
    peerOrder: number;
    // ISoftDeletedContent
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
    // IContent
    contentType: string;
    masterLanguageId: string;
    // IContentLanguage
    name: string;
    language: string;
    versionId: string;
    // contain all property's values which are defined as property (using decorator @Property) of content type
    // @key will be property name of content type
    properties: { [key: string]: any };
    status: number;
    // IPublishContent
    startPublish: Date;
    stopPublish: Date;
    delayPublishUntil: Date;
    publishedBy: string;

    // IContentVersion
    contentId: string | Content;
    masterVersionId: string;
    savedAt: Date;
    savedBy: string;
    // IContentHasChildItems
    childItems: ChildItemRef[];

    // Extension properties
    isPublished: boolean; // VersionStatus status == Published
    // [propName: string]: any;
}
