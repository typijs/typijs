import * as mongoose from 'mongoose';
import { cmsPublishedPage, IPublishedPageDocument } from '../page/models/published-page.model';
import { IBaseDocument, IBaseModel } from '../shared/base.model';

export interface ISiteDefinition {
    startPage: IPublishedPageDocument;
    siteUrl: string;
}

export interface ISiteDefinitionDocument extends ISiteDefinition, IBaseDocument { }
export interface ISiteDefinitionModel extends IBaseModel<ISiteDefinitionDocument> { }

const SiteDefinitionSchema = new mongoose.Schema({
    startPage: { type: mongoose.Schema.Types.ObjectId, ref: cmsPublishedPage },
    siteUrl: { type: String, unique: true, trim: true, lowercase: true },
}, { timestamps: true });

export const cmsSiteDefinition = 'cms_SiteDefinition';
export const SiteDefinitionModel: ISiteDefinitionModel = mongoose.model<ISiteDefinitionDocument, ISiteDefinitionModel>(cmsSiteDefinition, SiteDefinitionSchema);