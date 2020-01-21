import * as mongoose from 'mongoose';
import { cmsPageVersion, IPageVersion, PageVersionSchema, IPageVersionDocument } from './page-version.model';
import { IPublishedContentDocument, IPublishedContent } from '../../content/content.model';
import { IPageDocument } from './page.model';

export interface IPublishedPage extends IPageVersion, IPublishedContent {
    publishedLinkUrl?: string;
}

export interface IPublishedPageDocument extends IPublishedPage, IPageVersionDocument, IPublishedContentDocument { }
export const cmsPublishedPage = 'cms_PublishedPage'

const PublishedPageSchema = new mongoose.Schema({
    ...PageVersionSchema.obj,
    contentVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPageVersion, required: true },

}, { timestamps: true });

export const PublishedPageModel: mongoose.Model<IPublishedPageDocument> = mongoose.model<IPublishedPageDocument>(cmsPublishedPage, PublishedPageSchema);
