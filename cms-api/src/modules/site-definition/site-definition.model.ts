import * as mongoose from 'mongoose';
import { cmsPublishedPage, IPublishedPageDocument } from '../page/models/published-page.model';
import { IBaseDocument, IBaseModel, BaseSchema } from '../shared/base.model';

export interface ISiteDefinition {
    startPage: IPublishedPageDocument;
    siteUrl: string;
    language: string;
    isPrimary: boolean;
}

export interface ISiteDefinitionDocument extends ISiteDefinition, IBaseDocument { }
export interface ISiteDefinitionModel extends IBaseModel<ISiteDefinitionDocument> { }

const SiteDefinitionSchema = new mongoose.Schema({
    ...BaseSchema.obj,
    startPage: { type: mongoose.Schema.Types.ObjectId, ref: cmsPublishedPage },
    siteUrl: { type: String, unique: true, trim: true, lowercase: true },
    language: { type: String, trim: true, lowercase: true },
    isPrimary: { type: Boolean, required: true, default: false }
}, { timestamps: true });

export const cmsSiteDefinition = 'cms_SiteDefinition';
export const SiteDefinitionModel: ISiteDefinitionModel = mongoose.model<ISiteDefinitionDocument, ISiteDefinitionModel>(cmsSiteDefinition, SiteDefinitionSchema);