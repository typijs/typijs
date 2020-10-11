import * as mongoose from 'mongoose';
import { ContentHasChildItemsSchema, ContentLanguageSchema, IContentDocument, IContentLanguage, IContentModel } from "../../content/content.model";
import { cmsMediaVersion } from './media-version.model';
import { cmsMedia, cmsMediaLanguage } from './media.model';

export interface IMediaLanguage extends IContentLanguage {
    urlSegment: string;
    linkUrl: string;
    thumbnailUrl: string;

    mimeType: string;
    size: number;
    cloudId: string;
    deleteHash: string;
}
export interface IMediaLanguageDocument extends IMediaLanguage, IContentDocument { }
export interface IMediaLanguageModel extends IContentModel<IMediaLanguageDocument> { }
export const MediaLanguageSchema = new mongoose.Schema({
    ...ContentLanguageSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMedia },
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsMediaVersion },
    urlSegment: { type: String, required: true },
    linkUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: false },

    mimeType: { type: String, required: false },
    size: { type: Number, required: false },
    cloudId: { type: String, required: false },
    deleteHash: { type: String, required: false }
}, { timestamps: true });

export const MediaLanguageModel: IMediaLanguageModel = mongoose.model<IMediaLanguageDocument, IMediaLanguageModel>(cmsMediaLanguage, MediaLanguageSchema);