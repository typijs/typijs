import * as mongoose from 'mongoose';
import { ContentSchema, IContent, IContentDocument, IContentModel } from '../../content/content.model';

export const cmsPage = 'cms_Page';
export const cmsPageLanguage = 'cms_PageLanguage';
export interface IPage extends IContent {
  visibleInMenu: boolean;
}
export interface IPageDocument extends IPage, IContentDocument { }
export interface IPageModel extends IContentModel<IPageDocument> { }
export const PageSchema = new mongoose.Schema({
  ...ContentSchema.obj,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage },
  contentLanguages: [{ type: mongoose.Schema.Types.ObjectId, ref: cmsPageLanguage }],
  visibleInMenu: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const PageModel: IPageModel = mongoose.model<IPageDocument, IPageModel>(cmsPage, PageSchema);
