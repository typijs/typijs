import * as mongoose from 'mongoose';
import { ContentVersionSchema, IContentVersion, IContentVersionDocument, IContentVersionModel } from '../../content/content.model';
import { cmsBlock, cmsBlockVersion } from './block.model';


export interface IBlockVersion extends IContentVersion { }
export interface IBlockVersionDocument extends IBlockVersion, IContentVersionDocument { }
export interface IBlockVersionModel extends IContentVersionModel<IBlockVersionDocument> { }

export const BlockVersionSchema = new mongoose.Schema<IBlockVersionDocument, IBlockVersionModel>({
    ...ContentVersionSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlock, required: true },
    masterVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlockVersion }
}, { timestamps: true });

export const BlockVersionModel: IBlockVersionModel = mongoose.model<IBlockVersionDocument, IBlockVersionModel>(cmsBlockVersion, BlockVersionSchema);
