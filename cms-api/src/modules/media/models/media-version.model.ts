import * as mongoose from 'mongoose';
import { IContentVersion, IContentVersionDocument, IContentVersionModel } from '../../content/content.model';
import { IMediaDocument, IMedia, MediaSchema, cmsMedia } from './media.model';

export interface IMediaVersion extends IMedia, IContentVersion { }
export interface IMediaVersionDocument extends IMediaVersion, IMediaDocument, IContentVersionDocument { }
export interface IMediaVersionModel extends IContentVersionModel<IMediaVersionDocument> { }

export const cmsMediaVersion = 'cms_MediaVersion'
export const MediaVersionSchema = new mongoose.Schema({
    ...MediaSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia, required: true },
}, { timestamps: true });

export const MediaVersionModel: IMediaVersionModel = mongoose.model<IMediaVersionDocument, IMediaVersionModel>(cmsMediaVersion, MediaVersionSchema);
