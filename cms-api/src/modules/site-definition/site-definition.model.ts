import * as mongoose from 'mongoose';
import { cmsPublishedPage, IPublishedPageDocument } from '../page/models/published-page.model';

export interface ISiteDefinition {
    startPage: IPublishedPageDocument;
    siteUrl: string;
}

export interface ISiteDefinitionDocument extends ISiteDefinition, mongoose.Document { }

const siteDefinitionSchema = new mongoose.Schema({
    startPage: { type: mongoose.Schema.Types.ObjectId, ref: cmsPublishedPage },
    siteUrl: { type: String, unique: true, trim: true, lowercase: true },
}, { timestamps: true });

export const cmsSiteDefinition = 'cms_SiteDefinition';
export const SiteDefinitionModel: mongoose.Model<ISiteDefinitionDocument> = mongoose.model<ISiteDefinitionDocument>(cmsSiteDefinition, siteDefinitionSchema);