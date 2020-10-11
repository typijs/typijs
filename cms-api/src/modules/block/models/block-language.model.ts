import * as mongoose from 'mongoose';
import { ContentLanguageSchema, IContentDocument, IContentLanguage, IContentModel } from "../../content/content.model";
import { cmsBlockVersion } from './block-version.model';
import { cmsBlock, cmsBlockLanguage } from './block.model';

export interface IBlockLanguage extends IContentLanguage { }
export interface IBlockLanguageDocument extends IBlockLanguage, IContentDocument { }
export interface IBlockLanguageModel extends IContentModel<IBlockLanguageDocument> { }
export const BlockLanguageSchema = new mongoose.Schema({
    ...ContentLanguageSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlock },
    versionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsBlockVersion },
}, { timestamps: true });

export const BlockLanguageModel: IBlockLanguageModel = mongoose.model<IBlockLanguageDocument, IBlockLanguageModel>(cmsBlockLanguage, BlockLanguageSchema);