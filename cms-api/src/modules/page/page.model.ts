import * as mongoose from 'mongoose';
import { IPage } from './page.interface';
import { IContentModel } from '../content';

export interface IPageModel extends IPage, IContentModel { }

const pageSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser', required: false },

  changed: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser', required: false },

  published: Date,
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser' },

  deleted: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser' },

  name: { type: String, required: true },
  urlSegment: { type: String, required: true },
  linkUrl: { type: String, required: true, index: true },

  contentType: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage' },
  parentPath: { type: String, required: false, index: true },
  ancestors: { type: [String], required: false },
  hasChildren: { type: Boolean, required: true, default: false },
  //containt all reference Ids of all assets which be used in page such as block, media, page
  childItems: { type: [{ path: String, itemId: { type: mongoose.Schema.Types.ObjectId, refPath: 'childItems.path' } }], required: false },

  isPublished: { type: Boolean, required: true, default: false },
  isContentDeleted: { type: Boolean, required: true, default: false },

  isVisibleOnSite: { type: Boolean, required: true, default: true },
  sortIndex: Number,
  childrenSortCriteria: { type: String, enum: ['Asc', 'Desc'] },

  properties: mongoose.Schema.Types.Mixed
});

export const Page: mongoose.Model<IPageModel> = mongoose.model<IPageModel>('cmsPage', pageSchema);
