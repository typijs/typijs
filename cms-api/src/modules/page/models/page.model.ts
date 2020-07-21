import * as mongoose from 'mongoose';

import { IContentDocument, ContentSchema, ContentHasChildItemsSchema, IContent, IContentModel } from '../../content/content.model';

export interface IPage extends IContent {
  urlSegment: string;
  linkUrl: string;
  //not map to db
  publishedLinkUrl?: string;

  isVisibleOnSite: boolean;
  sortIndex: number;
  childrenSortCriteria: string;
}
export interface IPageDocument extends IPage, IContentDocument { }
export interface IPageModel extends IContentModel<IPageDocument> { }

export const cmsPage = 'cms_Page';
export const PageSchema = new mongoose.Schema({
  ...ContentSchema.obj,
  ...ContentHasChildItemsSchema.obj,

  urlSegment: { type: String, required: true },
  linkUrl: { type: String, required: true, index: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage },

  isVisibleOnSite: { type: Boolean, required: true, default: true },
  sortIndex: Number,
  childrenSortCriteria: { type: String, enum: ['Asc', 'Desc'] },
}, { timestamps: true });

export const PageModel: IPageModel = mongoose.model<IPageDocument, IPageModel>(cmsPage, PageSchema);
