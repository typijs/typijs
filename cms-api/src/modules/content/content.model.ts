import * as mongoose from 'mongoose';
import { cmsUser } from '../user/user.model';
import { IBaseDocument, IBaseModel, BaseSchema } from '../shared/base.model';
export type RefContent = {
    refPath: string;
    content: any;
}

export interface IContentHasChildItems {
    childItems: RefContent[];
}

export interface IHierarchyContent {
    parentId: string;
    parentPath: string;
    ancestors: string[];
    hasChildren: boolean;
    childOrderRule: number;
    peerOrder: number;
}

export interface ISoftDeletedContent {
    isDeleted: boolean;
    deletedAt: Date;
    deletedBy: string;
}

export interface IPublishContent {
    startPublish: Date;
    stopPublish: Date;
    delayPublishUntil: Date;
    publishedBy: string;
}

export interface IContentLanguage extends IPublishContent, IContentHasChildItems {
    language: string;
    versionId: string;
    name: string;
    properties: { [key: string]: any };
    /**
     * Ref to @VersionStatus
     */
    status: number;
    [key: string]: any;
}
export interface IContentLanguageDocument extends IContentLanguage, IBaseDocument { }

export interface IContent extends ISoftDeletedContent, IHierarchyContent {
    contentType: string;
    masterLanguageId: string;
    contentLanguages: Partial<IContentLanguageDocument>[];
    //not map to db
    versionId: string; //contain corresponding version id
}
export interface IContentDocument extends IContent, IBaseDocument { }
export interface IContentModel<T extends IContentDocument> extends IBaseModel<T> { }

export interface IContentVersion extends IPublishContent, IContentHasChildItems {
    contentId: string | IContentDocument;
    masterVersionId: string;
    language: string;
    childOrderRule: number;
    peerOrder: number;
    name: string;
    properties: any;
    isPrimary: boolean;
    savedAt: Date;
    savedBy: string;
    /**
     * Ref to @VersionStatus
     */
    status: number;
    [key: string]: any;
}

export interface IContentVersionDocument extends IContentVersion, IBaseDocument { }
export interface IContentVersionModel<T extends IContentVersionDocument> extends IBaseModel<T> { }

export const PublishContentSchema = new mongoose.Schema({
    //IPublishContent Implements
    startPublish: { type: Date },
    stopPublish: { type: Date },
    delayPublishUntil: { type: Date },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser }
});

export const ContentHasChildItemsSchema = new mongoose.Schema({
    //contain all reference Ids of all current contents which be used in page such as block, media, page
    childItems: [{
        refPath: { type: String, required: true },
        content: { type: mongoose.Schema.Types.ObjectId, refPath: 'contentLanguages.childItems.refPath' }
    }]
})

export const ContentSchema = new mongoose.Schema({
    ...BaseSchema.obj,
    contentType: { type: String, required: false },
    masterLanguageId: { type: String },
    //IHierarchyContent Implements
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    //https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-materialized-paths/
    parentPath: { type: String, required: false, index: true }, // ex ",parent1_id,parent2_id,parent3_id,"
    //https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/
    ancestors: { type: [String], required: false }, // ex [parent1_id, parent2_id, parent3_id]
    hasChildren: { type: Boolean, required: true, default: false },
    childOrderRule: { type: Number, required: true, default: 1 },
    peerOrder: { type: Number, required: true, default: 100 },

    //ISoftDeletedContent Implements
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser },
    isDeleted: { type: Boolean, required: true, default: false },
});

export const ContentLanguageSchema = new mongoose.Schema({
    ...BaseSchema.obj,
    ...PublishContentSchema.obj,
    ...ContentHasChildItemsSchema.obj,
    language: { type: String, required: true },
    name: { type: String, required: true, index: true },
    properties: mongoose.Schema.Types.Mixed,
    status: { type: Number, required: true, default: 2 }
});

export const ContentVersionSchema = new mongoose.Schema({
    ...ContentLanguageSchema.obj,
    childOrderRule: { type: Number, required: true, default: 1 },
    peerOrder: { type: Number, required: true, default: 100 },
    isPrimary: { type: Boolean, required: true, default: false },
    savedAt: { type: Date },
    savedBy: { type: mongoose.Schema.Types.ObjectId, ref: cmsUser }
});