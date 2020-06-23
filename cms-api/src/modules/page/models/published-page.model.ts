import * as mongoose from 'mongoose';
import { cmsPageVersion, IPageVersion, PageVersionSchema, IPageVersionDocument } from './page-version.model';
import { IPublishedContentDocument, IPublishedContent, IPublishedContentModel } from '../../content/content.model';

export interface IPublishedPage extends IPageVersion, IPublishedContent {
    publishedLinkUrl?: string;
}
export interface IPublishedPageDocument extends IPublishedPage, IPageVersionDocument, IPublishedContentDocument { }
export interface IPublishedPageModel extends IPublishedContentModel<IPublishedPageDocument> { }

export const cmsPublishedPage = 'cms_PublishedPage'
const PublishedPageSchema = new mongoose.Schema({
    ...PageVersionSchema.obj,
    contentVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPageVersion, required: true }
}, { timestamps: true });

export const PublishedPageModel: IPublishedPageModel = mongoose.model<IPublishedPageDocument, IPublishedPageModel>(cmsPublishedPage, PublishedPageSchema);
