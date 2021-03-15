export interface BaseModel {
    createdAt: Date;
    createdBy: any;

    updatedAt: Date;
    updatedBy: any;
}

/**
 * @typedef {Object} QueryResult
 * @param {Document[]} docs - Results found
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
 * @param {QuerySort} [sort] - Sort option in the format: `firstName lastName -score`
 * @param {number} [limit] - Maximum number of results per page (default = 10)
 * @param {number} [page] - Current page (default = 1)
 */
export type PaginateOptions = {
    sort?: QuerySort
    limit?: number
    page?: number
}

export type QuerySort = { [key: string]: 'asc' | 'desc' | 1 | -1 };
