import * as mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  name: String,
  contentType: String,
  parentId: String,
  nameInUrl: String,
  linkUrl: String,
  properties: mongoose.Schema.Types.Mixed
});
const Content = mongoose.model('Content', contentSchema);

export default Content;
