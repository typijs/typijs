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

  isDeleted: { type: Boolean, required: true, default: false },

  properties: mongoose.Schema.Types.Mixed
});
const Block = mongoose.model('cmsBlock', blockSchema);

export default Block;



