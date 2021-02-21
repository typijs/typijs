import * as mongoose from 'mongoose';
import { ContentLanguageSchema, ContentSchema, IContentDocument, IContentLanguageDocument, IContentModel } from '../../content/content.model';

export const ImageContent = 'ImageContent';
export const VideoContent = 'VideoContent';
export const FileContent = 'FileContent';
export const cmsMedia = 'cms_Media';
export const cmsMediaVersion = 'cms_MediaVersion'

export interface IMediaLanguage {
    urlSegment: string;
    linkUrl: string;
    thumbnail: string;

    mimeType: string;
    size: number;
    cloudId: string;
    deleteHash: string;
}
export interface IMediaLanguageDocument extends IMediaLanguage, IContentLanguageDocument { }
export const MediaLanguageSchema = new mongoose.Schema({
    ...ContentLanguageSchema.obj,
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMediaVersion },
    urlSegment: { type: String, required: true },
    linkUrl: { type: String, required: true },
    thumbnail: { type: String, required: false },

    mimeType: { type: String, required: false },
    size: { type: Number, required: false },
    cloudId: { type: String, required: false },
    deleteHash: { type: String, required: false }
}, { timestamps: true });

export interface IMediaDocument extends IContentDocument {
    contentLanguages: Partial<IMediaLanguageDocument>[];
}
export interface IMediaModel extends IContentModel<IMediaDocument> { }
export const MediaSchema = new mongoose.Schema<IMediaDocument, IMediaModel>({
    ...ContentSchema.obj,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia },
    contentLanguages: [MediaLanguageSchema]
}, { timestamps: true });

export const MediaModel: IMediaModel = mongoose.model<IMediaDocument, IMediaModel>(cmsMedia, MediaSchema);