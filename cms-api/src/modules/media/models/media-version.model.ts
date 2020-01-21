import * as mongoose from 'mongoose';
import { IContentVersion, IContentVersionDocument } from '../../content/content.model';
import { IMediaDocument, IMedia, MediaSchema, cmsMedia } from './media.model';

export interface IMediaVersion extends IMedia, IContentVersion { }

export interface IMediaVersionDocument extends IMediaVersion, IMediaDocument, IContentVersionDocument { }
export const cmsMediaVersion = 'cms_MediaVersion'

export const MediaVersionSchema = new mongoose.Schema({
    ...MediaSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia, required: true },
}, { timestamps: true });

export const MediaVersionModel: mongoose.Model<IMediaVersionDocument> = mongoose.model<IMediaVersionDocument>(cmsMediaVersion, MediaVersionSchema);
