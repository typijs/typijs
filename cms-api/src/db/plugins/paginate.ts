import { Schema } from "mongoose";
import { FilterQuery } from "../../modules/shared/base.model";

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
 * @param {string} [sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [limit] - Maximum number of results per page (default = 10)
 * @param {number} [page] - Current page (default = 1)
 */
export type PaginateOptions = {
    sortBy?: string
    limit?: number
    page?: number
}

const defaultQueryOptions: PaginateOptions = {
    limit: 10,
    page: 1
}
/**
 * Query for documents with pagination
 * @param filter - Query criteria - https://docs.mongodb.com/manual/tutorial/query-documents/
 * @param options 
 * @returns {Promise<PaginateResult>} Promise<PaginateResult>
 */
const paginateImplement = (filter: FilterQuery, options: PaginateOptions): Promise<PaginateResult> => {
    const sort = {};
    if (options.sortBy) {
        const parts = options.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    const limit = options.limit ? options.limit : 10;
    const page = options.page ? options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    const docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
        const [totalResults, results] = values;
        const totalPages = Math.ceil(totalResults / limit);
        const result: PaginateResult = {
            results,
            page,
            limit,
            totalPages,
            totalResults,
        };
        return Promise.resolve(result);
    });
}

export const paginate = (schema: Schema) => {
    schema.statics.paginate = function (filter: FilterQuery, options: PaginateOptions = defaultQueryOptions): Promise<PaginateResult> {
        return paginateImplement(filter, options)
    }
};