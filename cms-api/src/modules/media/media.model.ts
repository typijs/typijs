import * as mongoose from 'mongoose';
import { IMedia } from './media.interface';
import { IContentModel } from '../content';

export interface IMediaModel extends IMedia, IContentModel { }

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

    isContentDeleted: { type: Boolean, required: true, default: false },

    properties: mongoose.Schema.Types.Mixed
});

export const Media: mongoose.Model<IMediaModel> = mongoose.model<IMediaModel>('cmsMedia', mediaSchema);