import * as mongoose from 'mongoose';
import { cmsPage, IPageDocument } from '../page/models/page.model';
import { IBaseDocument, IBaseModel, BaseSchema } from '../shared/base.model';

export interface IHostDefinition {
    /**
     * The host name such as mysite.com, www.mysite.org:80 ..(not include protocol http or https)
     */
    name: string;
    /**
     * The default language of host
     */
    language: string;
    isPrimary: boolean;
    /** Gets or sets a value indicating whether HTTPS should be preferred when generating links to this host. */
    isHttps: boolean;
}

export interface IHostDefinitionDocument extends IHostDefinition, IBaseDocument { }

export interface ISiteDefinition {
    startPage: string | IPageDocument;
    name: string;
    hosts: IHostDefinitionDocument[]
}

export interface ISiteDefinitionDocument extends ISiteDefinition, IBaseDocument { }
export interface ISiteDefinitionModel extends IBaseModel<ISiteDefinitionDocument> { }

const HostDefinitionSchema = new mongoose.Schema({
    ...BaseSchema.obj,
    name: { type: String, unique: true, required: true, trim: true, lowercase: true },
    language: { type: String, trim: true, required: true, lowercase: true },
    isPrimary: { type: Boolean, required: true, default: false },
    isHttps: { type: Boolean, required: false }
}, { timestamps: true });

const SiteDefinitionSchema = new mongoose.Schema<ISiteDefinitionDocument, ISiteDefinitionModel>({
    ...BaseSchema.obj,
    startPage: { type: mongoose.Schema.Types.ObjectId, ref: cmsPage, required: true, unique: true },
    name: { type: String, unique: true, trim: true, required: true, lowercase: true },
    hosts: [HostDefinitionSchema]
}, { timestamps: true });

export const cmsSiteDefinition = 'cms_SiteDefinition';
export const SiteDefinitionModel: ISiteDefinitionModel = mongoose.model<ISiteDefinitionDocument, ISiteDefinitionModel>(cmsSiteDefinition, SiteDefinitionSchema);