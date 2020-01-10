import * as mongoose from 'mongoose';
import { ISiteDefinition } from './site-definition.interface';

export interface ISiteDefinitionModel extends ISiteDefinition, mongoose.Document { }

const siteDefinitionSchema = new mongoose.Schema({
    startPage: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage' },
    siteUrl: { type: String, unique: true, trim: true, lowercase: true },

    created: { type: Date, default: Date.now },
    changed: { type: Date, default: Date.now }
});

export const SiteDefinition: mongoose.Model<ISiteDefinitionModel> = mongoose.model<ISiteDefinitionModel>('cmsSiteDefinition', siteDefinitionSchema);