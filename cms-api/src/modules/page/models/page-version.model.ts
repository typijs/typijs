import * as mongoose from 'mongoose';
import { cmsPage, IPage, PageSchema } from './page.model';

export interface IPageVersion extends IPage {
    pageId: any;
}

export interface IPageVersionDocument extends IPageVersion, mongoose.Document { }
export const cmsPageVersion = 'cms_PageVersion'

export const PageVersionSchema = new mongoose.Schema({
    ...PageSchema.obj,
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage, required: true },
}, { timestamps: true });

export const PageVersionModel: mongoose.Model<IPageVersionDocument> = mongoose.model<IPageVersionDocument>(cmsPageVersion, PageVersionSchema);
