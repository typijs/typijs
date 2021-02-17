import * as mongoose from 'mongoose';
import { ContentSchema, IContent, IContentDocument, IContentModel } from '../../content/content.model';

export const cmsBlock = 'cms_Block';
export const cmsBlockLanguage = 'cms_BlockLanguage';

export interface IBlock extends IContent { }
export interface IBlockDocument extends IBlock, IContentDocument { }
export interface IBlockModel extends IContentModel<IBlockDocument> { }

export const BlockSchema = new mongoose.Schema({
  ...ContentSchema.obj,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlock },
  contentLanguages: [{ type: mongoose.Schema.Types.ObjectId, ref: cmsBlockLanguage }]
}, { timestamps: true });

export const BlockModel: IBlockModel = mongoose.model<IBlockDocument, IBlockModel>(cmsBlock, BlockSchema);



