import * as mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    created: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser', required: false },

    changed: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser', required: false },

    name: { type: String, required: true },
    mimeType: { type: String, required: false },
    size: { type: String, required: false },

    parentId: String,
    parentPath: { type: String, required: false },
    hasChildren: { type: Boolean, required: true, default: false },

    isDeleted: { type: Boolean, required: true, default: false }
});

export const Media = mongoose.model('cmsMedia', mediaSchema);