import * as mongoose from 'mongoose';
import { IContentDocument, IContent, ContentSchema, IContentModel } from '../../content/content.model';

export interface IMedia extends IContent {
    mimeType: string;
    size: number;
    thumbnail: string;
    cloudId: string;
    deleteHash: string;
    link: string;
    [key: string]: any;
}

export interface IMediaDocument extends IMedia, IContentDocument { }
export interface IMediaModel extends IContentModel<IMediaDocument> { }

export const ImageContent = 'ImageContent';
export const VideoContent = 'VideoContent';
export const FileContent = 'FileContent';

export const cmsMedia = 'cms_Media';
export const MediaSchema = new mongoose.Schema({
    ...ContentSchema.obj,

    mimeType: { type: String, required: false },
    size: { type: Number, required: false },
    thumbnail: { type: String, required: false },
    cloudId: { type: String, required: false },
    deleteHash: { type: String, required: false },
    link: { type: String, required: false },

    parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia }
}, { timestamps: true });

export const MediaModel: IMediaModel = mongoose.model<IMediaDocument, IMediaModel>(cmsMedia, MediaSchema);