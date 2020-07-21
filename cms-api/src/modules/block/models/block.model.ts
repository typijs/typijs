import * as mongoose from 'mongoose';
import { IContentDocument, IContent, ContentHasChildItemsSchema, ContentSchema, IContentModel, } from '../../content/content.model';

export interface IBlock extends IContent { }
export interface IBlockDocument extends IBlock, IContentDocument { }
export interface IBlockModel extends IContentModel<IBlockDocument> { }

export const cmsBlock = 'cms_Block';
export const BlockSchema = new mongoose.Schema({
  ...ContentSchema.obj,
  ...ContentHasChildItemsSchema.obj,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlock }
}, { timestamps: true });

export const BlockModel: IBlockModel = mongoose.model<IBlockDocument, IBlockModel>(cmsBlock, BlockSchema);



