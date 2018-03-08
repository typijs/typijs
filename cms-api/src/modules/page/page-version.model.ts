import * as mongoose from 'mongoose';

const pageVersionSchema = new mongoose.Schema({

    originPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage', required: true },

    name: { type: String, required: true },
    urlSegment: { type: String, required: true },
    linkUrl: { type: String, required: true },

    contentType: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsPage' },
    //containt all reference Ids of all assets which be used in page such as block, media, page
    childItems: { type: [{path: String, itemId: {type: mongoose.Schema.Types.ObjectId, refPath: 'childItems.path'}}], required: false },


    published: { type: Date, required: true, default: Date.now },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cmsUser' },

    isLastPublished: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },

    isVisibleOnSite: { type: Boolean, required: true, default: true },

    properties: mongoose.Schema.Types.Mixed
});
const PageVersion = mongoose.model('cmsPageVersion', pageVersionSchema);

export default PageVersion;
