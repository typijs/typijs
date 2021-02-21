import * as mongoose from 'mongoose';
import { ContentLanguageSchema, ContentSchema, IContent, IContentDocument, IContentLanguage, IContentLanguageDocument, IContentModel } from '../../content/content.model';
import { cmsPageVersion } from './page-version.model';

export const cmsPage = 'cms_Page';
export const cmsPageLanguage = 'cms_PageLanguage';

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
