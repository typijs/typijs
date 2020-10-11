import * as mongoose from 'mongoose';
import { ContentVersionSchema, IContentVersion, IContentVersionDocument, IContentVersionModel } from '../../content/content.model';
import { cmsPage } from './page.model';

export const cmsPageVersion = 'cms_PageVersion';
export interface IPageVersion extends IContentVersion {
    urlSegment: string;
    linkUrl: string;
    visibleInMenu: boolean;
}
export interface IPageVersionDocument extends IPageVersion, IContentVersionDocument { }
export interface IPageVersionModel extends IContentVersionModel<IPageVersionDocument> { }
export const PageVersionSchema = new mongoose.Schema({
    ...ContentVersionSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage, required: true },
    masterVersionId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPageVersion },
    urlSegment: { type: String, required: true },
    linkUrl: { type: String, required: true },
    visibleInMenu: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const PageVersionModel: IPageVersionModel = mongoose.model<IPageVersionDocument, IPageVersionModel>(cmsPageVersion, PageVersionSchema);