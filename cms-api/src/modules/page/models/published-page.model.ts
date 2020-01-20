import * as mongoose from 'mongoose';
import { cmsPageVersion, IPageVersion, PageVersionSchema } from './page-version.model';

export interface IPublishedPage extends IPageVersion {
    pageVersionId: any;
    publishedLinkUrl?: string;
}

export interface IPublishedPageDocument extends IPublishedPage, mongoose.Document { }
export const cmsPublishedPage = 'cms_PublishedPage'

const PublishedPageSchema = new mongoose.Schema({
    ...PageVersionSchema.obj,
    pageVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPageVersion, required: true },

}, { timestamps: true });

export const PublishedPageModel: mongoose.Model<IPublishedPageDocument> = mongoose.model<IPublishedPageDocument>(cmsPublishedPage, PublishedPageSchema);
