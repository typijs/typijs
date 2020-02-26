import * as mongoose from 'mongoose';
import { IBlock, BlockSchema, cmsBlock, IBlockDocument } from './block.model';
import { IContentVersion, IContentVersionDocument } from '../../content/content.model';

export interface IBlockVersion extends IBlock, IContentVersion { }

export interface IBlockVersionDocument extends IBlockVersion, IBlockDocument, IContentVersionDocument { }
export const cmsBlockVersion = 'cms_BlockVersion'

export const BlockVersionSchema = new mongoose.Schema({
    ...BlockSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlock, required: true },
}, { timestamps: true });

export const BlockVersionModel: mongoose.Model<IBlockVersionDocument> = mongoose.model<IBlockVersionDocument>(cmsBlockVersion, BlockVersionSchema);
