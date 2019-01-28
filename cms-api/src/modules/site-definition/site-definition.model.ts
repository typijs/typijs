import * as mongoose from 'mongoose';

const siteDefinitionSchema = new mongoose.Schema({
    startPage: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage' },
    siteUrl: { type: String, unique: true, trim: true, lowercase: true },

    created: { type: Date, default: Date.now },
    changed: { type: Date, default: Date.now }
});

export const SiteDefinition = mongoose.model('cmsSiteDefinition', siteDefinitionSchema);