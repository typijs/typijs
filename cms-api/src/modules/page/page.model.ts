import * as mongoose from 'mongoose';

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
  linkUrl: { type: String, required: true },

  contentType: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage' },
  parentPath: { type: String, required: true },
  hasChildren: { type: Boolean, required: true, default: false },

  isPublished: { type: Boolean, required: true, default: false },
  isDeleted: { type: Boolean, required: true, default: false },

  isVisibleOnSite: { type: Boolean, required: true, default: true },
  sortIndex: Number,
  childrenSortCriteria: { type: String, enum: ['Asc', 'Desc'] },

  properties: mongoose.Schema.Types.Mixed
});
const Page = mongoose.model('cmsPage', pageSchema);

export default Page;
