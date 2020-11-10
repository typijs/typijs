import * as mongoose from 'mongoose';
import { Document, Model, FilterQuery, DocumentQuery } from 'mongoose';

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

/**
 * @typedef {Object} PaginateResult
 * @param {Document[]} results - Results found
 * @param {number} page - Current page
 * @param {number} limit - Maximum number of results per page
 * @param {number} totalPages - Total number of pages
 * @param {number} totalResults - Total number of documents
 */
export type PaginateResult = {
    results: Document[]
    page: number
    limit: number
    totalPages: number
    totalResults: number
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
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'cms_User', required: false }
})

export type QueryList<T extends IBaseDocument> = DocumentQuery<T[], T>;
export type QueryItem<T extends IBaseDocument> = DocumentQuery<T, T>;