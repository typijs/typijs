import * as mongoose from 'mongoose';
import { IContentDocument, IContent, ContentSchema, IContentModel } from '../../content/content.model';

export const ImageContent = 'ImageContent';
export const VideoContent = 'VideoContent';
export const FileContent = 'FileContent';
export const cmsMedia = 'cms_Media';
export const cmsMediaLanguage = 'cms_MediaLanguage';

export interface IMedia extends IContent { }

export interface IMediaDocument extends IMedia, IContentDocument { }
export interface IMediaModel extends IContentModel<IMediaDocument> { }
export const MediaSchema = new mongoose.Schema({
    ...ContentSchema.obj,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia },
    contentLanguages: [{ type: mongoose.Schema.Types.ObjectId, ref: cmsMediaLanguage }]
}, { timestamps: true });

export const MediaModel: IMediaModel = mongoose.model<IMediaDocument, IMediaModel>(cmsMedia, MediaSchema);