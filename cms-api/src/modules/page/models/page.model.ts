import * as mongoose from 'mongoose';
import { ContentLanguageSchema, ContentSchema, IContentDocument, IContentLanguageDocument, IContentModel } from '../../content/content.model';

export const cmsPage = 'cms_Page';
export const cmsPageVersion = 'cms_PageVersion';

export interface IPageLanguage {
  urlSegment: string;
  simpleAddress: string;
  linkUrl: string;
}
export interface IPageLanguageDocument extends IPageLanguage, IContentLanguageDocument { }
export const PageLanguageSchema = new mongoose.Schema({
  ...ContentLanguageSchema.obj,
  versionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPageVersion },
  urlSegment: { type: String, required: true },
  simpleAddress: { type: String, required: false, lowercase: true, trim: true }
}, { timestamps: true });

export interface IPage {
  visibleInMenu: boolean;
}
export interface IPageDocument extends IPage, IContentDocument {
  contentLanguages: Partial<IPageLanguageDocument>[];
}
export interface IPageModel extends IContentModel<IPageDocument> { }
export const PageSchema = new mongoose.Schema<IPageDocument, IPageModel>({
  ...ContentSchema.obj,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage },
  contentLanguages: [PageLanguageSchema],
  visibleInMenu: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const PageModel: IPageModel = mongoose.model<IPageDocument, IPageModel>(cmsPage, PageSchema);
