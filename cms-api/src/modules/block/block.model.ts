import * as mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser', required: true },

  changed: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser', required: true },

  name: { type: String, required: true },
  contentType: { type: String, required: true },

  parentId: String,
  parentPath: { type: String, required: false },
  hasChildren: { type: Boolean, required: true, default: false },
  //containt all reference Ids of all assets which be used in page such as block, media, page
  childItems: { type: [{path: String, itemId: {type: mongoose.Schema.Types.ObjectId, refPath: 'childItems.path'}}], required: true },

  isDeleted: { type: Boolean, required: true, default: false },

  properties: mongoose.Schema.Types.Mixed
});
const Block = mongoose.model('cmsBlock', blockSchema);

export default Block;



