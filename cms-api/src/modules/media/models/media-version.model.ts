import * as mongoose from 'mongoose';
import { ContentVersionSchema, IContentVersion, IContentVersionDocument, IContentVersionModel } from '../../content/content.model';
import { cmsMedia } from './media.model';

export interface IMediaVersion extends IContentVersion {
    urlSegment: string;
    linkUrl: string;
    thumbnail: string;

    mimeType: string;
    size: number;
    cloudId: string;
    deleteHash: string;
}
export interface IMediaVersionDocument extends IMediaVersion, IContentVersionDocument { }
export interface IMediaVersionModel extends IContentVersionModel<IMediaVersionDocument> { }

export const MediaVersionSchema = new mongoose.Schema<IMediaVersionDocument, IMediaVersionModel>({
    ...ContentVersionSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia, required: true },
    masterVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMediaVersion },
    urlSegment: { type: String, required: true },
    linkUrl: { type: String, required: true },
    thumbnail: { type: String, required: false },

    mimeType: { type: String, required: false },
    size: { type: Number, required: false },
    cloudId: { type: String, required: false },
    deleteHash: { type: String, required: false }
}, { timestamps: true });

export const MediaVersionModel: IMediaVersionModel = mongoose.model<IMediaVersionDocument, IMediaVersionModel>(cmsMediaVersion, MediaVersionSchema);
