import { Schema, Document } from "mongoose";

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

/**
 * Query for documents with pagination
 * @param filter - Query criteria - https://docs.mongodb.com/manual/tutorial/query-documents/
 * @param paginateOptions 
 * @returns {Promise<PaginateResult>} Promise<PaginateResult>
 */
const paginateImplement = (filter, paginateOptions: PaginateOptions, queryOptions?: any): Promise<PaginateResult> => {
    const sort = {};
    if (paginateOptions.sortBy) {
        const parts = paginateOptions.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    const limit = paginateOptions.limit ? paginateOptions.limit : 10;
    const page = paginateOptions.page ? paginateOptions.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.count(filter).exec();
    const docsQuery = this.find(filter).sort(sort).skip(skip).limit(limit)
    const docsPromise = queryOptions ? docsQuery.setOptions(queryOptions).exec() : docsQuery.exec();

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
    schema.statics.paginate = function (filter, paginateOptions: PaginateOptions, queryOptions?): Promise<PaginateResult> {
        return paginateImplement(filter, paginateOptions, queryOptions)
    }
};