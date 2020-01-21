import * as mongoose from 'mongoose';
import { IBlockVersion, BlockVersionSchema, cmsBlockVersion, IBlockVersionDocument } from './block-version.model';
import { IPublishedContentDocument, IPublishedContent } from '../../content/content.model';

export interface IPublishedBlock extends IBlockVersion, IPublishedContent {
}

export interface IPublishedBlockDocument extends IPublishedBlock, IBlockVersionDocument, IPublishedContentDocument { }
export const cmsPublishedBlock = 'cms_PublishedBlock'

export const PublishedBlockSchema = new mongoose.Schema({
    ...BlockVersionSchema.obj,
    contentVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlockVersion, required: true },

}, { timestamps: true });

export const PublishedBlockModel: mongoose.Model<IPublishedBlockDocument> = mongoose.model<IPublishedBlockDocument>(cmsPublishedBlock, PublishedBlockSchema);
