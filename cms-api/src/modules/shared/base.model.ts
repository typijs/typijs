import * as mongoose from 'mongoose';
import { Document, Model, Query } from 'mongoose';

export type QuerySort = { [key: string]: 'asc' | 'desc' | 1 | -1 };

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

    /**
     * The Mongoose select field syntax (for example: `'_id name created'`)
     */
    select?: string;
}

/**
 * @typedef {Object} QueryResult
 * @param {Document[]} results - Results found
 * @param {number} page - Current page
 * @param {number} limit - Maximum number of results per page
 * @param {number} pages - Total number of pages
 * @param {number} total - Total number of documents
 */
export type QueryResult<T> = {
    docs: T[]
    page?: number
    limit?: number
    pages?: number
    total?: number
}

/**
 * QueryOption type
 * @param {string} [sortBy] - Sort option in the format: `firstName lastName -score`
 * @param {number} [limit] - Maximum number of results per page (default = 10)
 * @param {number} [page] - Current page (default = 1)
 */
export type PaginateOptions = {
    sortBy?: string
    limit?: number
    page?: number
    sort?: QuerySort
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
export interface IBaseModel<T extends IBaseDocument> extends Model<T> { }

export const BaseSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cms_User', required: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cms_User', required: false }
})

export type QueryList<T extends IBaseDocument> = Query<T[], T>;
export type QueryItem<T extends IBaseDocument> = Query<T, T>;