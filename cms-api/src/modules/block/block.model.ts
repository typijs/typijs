import * as mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  name: String,
  contentType: String,
  parentId: String,
  properties: mongoose.Schema.Types.Mixed
});
const Block = mongoose.model('Block', blockSchema);

export default Block;
