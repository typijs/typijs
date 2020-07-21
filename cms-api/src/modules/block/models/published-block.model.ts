import * as mongoose from 'mongoose';
import { IBlockVersion, BlockVersionSchema, cmsBlockVersion, IBlockVersionDocument } from './block-version.model';
import { IPublishedContentDocument, IPublishedContent, IPublishedContentModel } from '../../content/content.model';

export interface IPublishedBlock extends IBlockVersion, IPublishedContent { }
export interface IPublishedBlockDocument extends IPublishedBlock, IBlockVersionDocument, IPublishedContentDocument { }
export interface IPublishedBlockModel extends IPublishedContentModel<IPublishedBlockDocument> { }

export const cmsPublishedBlock = 'cms_PublishedBlock'

export const PublishedBlockSchema = new mongoose.Schema({
    ...BlockVersionSchema.obj,
    contentVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlockVersion, required: true },

}, { timestamps: true });

export const PublishedBlockModel: IPublishedBlockModel = mongoose.model<IPublishedBlockDocument, IPublishedBlockModel>(cmsPublishedBlock, PublishedBlockSchema);
