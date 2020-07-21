import * as mongoose from 'mongoose';
import { cmsPage, IPage, PageSchema, IPageDocument } from './page.model';
import { IContentVersionDocument, IContentVersion, IContentVersionModel } from '../../content/content.model';

export interface IPageVersion extends IPage, IContentVersion { }
export interface IPageVersionDocument extends IPageVersion, IPageDocument, IContentVersionDocument { }
export interface IPageVersionModel extends IContentVersionModel<IPageVersionDocument> { }

export const cmsPageVersion = 'cms_PageVersion'
export const PageVersionSchema = new mongoose.Schema({
    ...PageSchema.obj,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage, required: true },
}, { timestamps: true });

export const PageVersionModel: IPageVersionModel = mongoose.model<IPageVersionDocument, IPageVersionModel>(cmsPageVersion, PageVersionSchema);