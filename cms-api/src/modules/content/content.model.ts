import * as mongoose from 'mongoose';
import { cmsUser } from '../user/user.model';
import { ICommonMetadata, Timestamps } from '../shared/base.model';

export type RefContent = {
    refPath: string;
    content: any;
}

export interface IHierarchyContent {
    parentId: string;
    parentPath: string;
    ancestors: string[];
    hasChildren: boolean;
}

export interface ISoftDeletedContent {
    isDeleted: boolean;
}

export interface IPublishableContent {
    published: Date;
    publishedBy: any;

    isPublished: boolean;
}

export interface IContentHasChildItems {
    childItems: RefContent[];
    publishedChildItems: RefContent[];
}

export interface IFolder extends ISoftDeletedContent, IHierarchyContent, ICommonMetadata, Timestamps {
    name: string;
}

export interface IContent extends IContentHasChildItems, IPublishableContent, ISoftDeletedContent, IHierarchyContent, ICommonMetadata, Timestamps {
    name: string;

    contentType: string;
    properties: any;

    //not map to db
    isDirty: boolean;
}

export interface IContentVersion extends IContent {
    contentId: any;
}

export interface IPublishedContent extends IContentVersion {
    contentVersionId: any;
}

export interface IFolderDocument extends IFolder, mongoose.Document { }

export interface IContentDocument extends IContent, mongoose.Document { }

export interface IContentVersionDocument extends IContentVersion, mongoose.Document { }

export interface IPublishedContentDocument extends IPublishedContent, mongoose.Document { }

export const ContentSchema = new mongoose.Schema({
    created: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser, required: false },

    changed: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser, required: false },

    published: Date,
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser },

    deleted: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser },

    name: { type: String, required: true },
    contentType: { type: String, required: false },

    parentId: { type: String, default: null },
    //https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-materialized-paths/
    parentPath: { type: String, required: false, index: true }, // ex ",parent1_id,parent2_id,parent3_id,"
    //https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/
    ancestors: { type: [String], required: false }, // ex [parent1_id, parent2_id, parent3_id]
    hasChildren: { type: Boolean, required: true, default: false },

    isPublished: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },

    properties: mongoose.Schema.Types.Mixed
});

export const ContentHasChildItemsSchema = new mongoose.Schema({
    //contain all reference Ids of all current contents which be used in page such as block, media, page
    childItems: [{
        refPath: { type: String, required: true },
        content: { type: mongoose.Schema.Types.ObjectId, refPath: 'childItems.refPath' }
    }],
    //contain all reference Ids of all published contents which be used in page such as block, media, page
    publishedChildItems: [{
        refPath: { type: String, required: true },
        content: { type: mongoose.Schema.Types.ObjectId, refPath: 'publishedChildItems.refPath' }
    }]
})