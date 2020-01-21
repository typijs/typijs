import * as mongoose from 'mongoose';
import { IContentDocument, IContent, IContentHasChildItems, ContentHasChildItemsSchema, ContentSchema, } from '../../content/content.model';

export interface IBlock extends IContent, IContentHasChildItems { }

export interface IBlockDocument extends IBlock, IContentDocument { }

export const cmsBlock = 'cms_Block';

export const BlockSchema = new mongoose.Schema({
  ...ContentSchema.obj,
  ...ContentHasChildItemsSchema.obj,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlock }
}, { timestamps: true });

export const BlockModel: mongoose.Model<IBlockDocument> = mongoose.model<IBlockDocument>(cmsBlock, BlockSchema);



