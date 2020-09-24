import * as mongoose from 'mongoose';
import { Document, Model, FilterQuery, DocumentQuery } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../db/plugins/paginate';

export type QueryOptions = {
    /**
     * The lean option tells Mongoose to skip hydrating the result documents. 
     * 
     * If `lean = true`, this makes queries faster and less memory intensive, but the result documents are plain old JavaScript objects (POJOs), 
     * not Mongoose documents.
     * 
     * Default = false
     */
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