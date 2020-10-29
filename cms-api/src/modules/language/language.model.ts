import * as mongoose from 'mongoose';
import { IBaseDocument, IBaseModel, BaseSchema } from '../shared/base.model';

export type Language = {
    code: string;
    name: string;
    nativeName: string;
}
export interface ILanguageBranch {
    language: string;
    name: string;
    sortIndex: number;
    iconPath: string;
    enabled: boolean;
}

export interface ILanguageBranchDocument extends ILanguageBranch, IBaseDocument { }
export interface ILanguageBranchModel extends IBaseModel<ILanguageBranchDocument> { }

const LanguageBranchSchema = new mongoose.Schema({
    ...BaseSchema.obj,
    language: { type: String, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    sortIndex: { type: Number },
    iconPath: { type: String },
    enabled: { type: Boolean, required: true, default: true }
}, { timestamps: true });

export const cmsLanguageBranch = 'cms_LanguageBranch';
export const LanguageBranchModel: ILanguageBranchModel = mongoose.model<ILanguageBranchDocument, ILanguageBranchModel>(cmsLanguageBranch, LanguageBranchSchema);

