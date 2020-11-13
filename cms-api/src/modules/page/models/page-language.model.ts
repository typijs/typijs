import * as mongoose from 'mongoose';
import { ContentLanguageSchema, IContentDocument, IContentLanguage, IContentModel } from "../../content/content.model";
import { cmsPageVersion } from './page-version.model';
import { cmsPage, cmsPageLanguage } from './page.model';

export interface IPageLanguage extends IContentLanguage {
    urlSegment: string;
    simpleAddress: string;
    linkUrl: string;
}
export interface IPageLanguageDocument extends IPageLanguage, IContentDocument { }
export interface IPageLanguageModel extends IContentModel<IPageLanguageDocument> { }
export const PageLanguageSchema = new mongoose.Schema({
    ...ContentLanguageSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage },
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPageVersion },
    urlSegment: { type: String, required: true },
    simpleAddress: { type: String, required: false, lowercase: true, trim: true }
}, { timestamps: true });

export const PageLanguageModel: IPageLanguageModel = mongoose.model<IPageLanguageDocument, IPageLanguageModel>(cmsPageLanguage, PageLanguageSchema);