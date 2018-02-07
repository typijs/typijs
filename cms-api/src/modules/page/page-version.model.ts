import * as mongoose from 'mongoose';

const pageVersionSchema = new mongoose.Schema({

    originPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage', required: true },

    name: { type: String, required: true },
    urlSegment: { type: String, required: true },
    linkUrl: { type: String, required: true },

    contentType: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage' },

    published: { type: Date, default: Date.now },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser' },

    isLastPublished: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },

    isVisibleOnSite: { type: Boolean, required: true, default: true },

    properties: mongoose.Schema.Types.Mixed
});
const PageVersion = mongoose.model('cmsPageVersion', pageVersionSchema);

export default PageVersion;
