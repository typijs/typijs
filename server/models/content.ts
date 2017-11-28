import * as mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  name: String,
  value: String
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
