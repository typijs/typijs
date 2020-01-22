import * as mongoose from 'mongoose';

import { IContentDocument, ContentSchema, ContentHasChildItemsSchema, IContentHasChildItems, IContent } from '../../content/content.model';

export interface IPage extends IContent {
  urlSegment: string;
  linkUrl: string;

  isVisibleOnSite: boolean;
  sortIndex: number;
  childrenSortCriteria: string;
}

export const cmsPage = 'cms_Page';
export interface IPageDocument extends IPage, IContentDocument { }

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

export const PageModel: mongoose.Model<IPageDocument> = mongoose.model<IPageDocument>(cmsPage, PageSchema);
