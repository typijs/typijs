import * as mongoose from 'mongoose';
import { Document, Model, FilterQuery, DocumentQuery } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../db/plugins/paginate';

export type QueryOptions = {
    lean?: boolean;
}

export interface ICommonMetadata {
    createdAt: Date;
    createdBy: any;

    updatedAt: Date;
    updatedBy: any;
}

export interface IBaseDocument extends ICommonMetadata, Document {
    //Should defined the member methods here
}
export interface IBaseModel<T extends IBaseDocument> extends Model<T> {
    //Should defined the static methods here
    paginate(filter: FilterQuery<T>, paginateOptions?: PaginateOptions, queryOptions?: QueryOptions): Promise<PaginateResult>;
}

export const BaseSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cms_User', required: false },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cms_User', required: false }
})

export type QueryList<T extends IBaseDocument> = DocumentQuery<T[], T>;
export type QueryItem<T extends IBaseDocument> = DocumentQuery<T, T>;