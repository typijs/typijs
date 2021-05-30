import { FilterQuery, Query, UpdateQuery } from 'mongoose';
import { ConfigManager } from '../../config';
import { TenantDatabases } from "../../db/tenant-database";
import { DocumentNotFoundException } from '../../error';
import { IBaseDocument, IBaseModel, QueryItem, QueryList, QueryOptions, PaginateOptions, QueryResult } from './base.model';

export class BaseService<T extends IBaseDocument> {
    constructor(private mongooseModel: IBaseModel<T>, private modelName?: string, private schema?: any) {
        if (ConfigManager.getConfig().mongdb.multiTenant && modelName && schema) {
            TenantDatabases.preCreateModel(modelName, schema);
        }
    }

    public get Model(): IBaseModel<T> {
        return ConfigManager.getConfig().mongdb.multiTenant ? this.TenantModel : this.mongooseModel;
    }

    /**
     * Create an instance of mongoose Model. When you use this method, you create a new document.
     * @returns the new document which is an instance of mongoose Model
     */
    public createModel = (doc: Partial<T>): T => {
        const modelInstance = new this.Model(doc);
        return Object.assign(modelInstance, doc);
    }

    /**
     * Get document by _id
     * @param id The mongodb Object id
     * @param options query option ex `{ lean: true }`
     * @returns return the `QueryItem<T>` then need to call `exec()` to convert to `Promise<T>`
     */
    public findById = (id: string, options?: QueryOptions): QueryItem<T> => {
        if (!id) id = null;
        return this.Model.findById(id).setOptions(this.getQueryOptions(options));
    }

    /**
     * Get the first of match document
     * @param filter Mongo Query - https://docs.mongodb.com/manual/tutorial/query-documents/
     * @param options query option ex `{ lean: true }`
     * @returns return the `QueryItem<T>` then need to call `exec()` to convert to `Promise<T>`
     */
    public findOne = (filter: FilterQuery<T>, options?: QueryOptions): QueryItem<T> => {
        return this.Model.findOne(filter).setOptions(this.getQueryOptions(options));
    }

    /**
     * Find documents which match the filter conditions
     * @param filter Mongo Query - https://docs.mongodb.com/manual/tutorial/query-documents/
     * @param options query option ex `{ lean: true }`
     * @returns return the `QueryList<T>` then need to call `exec()` to convert to `Promise<T[]>`
     */
    public find = (filter: FilterQuery<T>, options?: QueryOptions): QueryList<T> => {
        //return this.mongooseModel.find(filter).setOptions(this.getQueryOptions(options));
        return this.Model.find(filter).setOptions(this.getQueryOptions(options));
    }

    /**
     * Get all documents. Should only use for collection which has less document
     * @param options query option ex `{ lean: true }`
     */
    public getAll = (options?: QueryOptions): QueryList<T> => {
        return this.find({}, options);
    }

    /**
     * Get all documents. Should only use for collection which has less document
     * @param options query option ex `{ lean: true }`
     */
    public count = (filter: FilterQuery<T>): Promise<number> => {
        if (Object.keys(filter).length === 0 && filter.constructor === Object) {
            return this.Model.estimatedDocumentCount().exec();
        }
        return this.Model.countDocuments(filter).exec()
    }

    /**
     * Get all documents. Should only use for collection which has less document
     * @param options query option ex `{ lean: true }`
     */
    public exists = (filter: FilterQuery<T>): Promise<boolean> => {
        return this.Model.exists(filter)
    }

    /**
     * Query for document support paging
     * @param {FilterQuery<T>} filter - Mongo Query - https://docs.mongodb.com/manual/tutorial/query-documents/
     * @param {Object} paginateOptions - Paginate options
     * @param {Object} queryOptions - query option ex `{ lean: true }`
     * @returns {Promise<QueryResult>}
     */
    public paginate = (filter: FilterQuery<T>, paginateOptions?: PaginateOptions, queryOptions?: QueryOptions): Promise<QueryResult<T>> => {
        //query.sort('firstName -lastName');  query.sort({ firstName: 'asc', lastName: -1 });
        const { sortBy, page, limit } = this.getPaginateOptions(paginateOptions);
        const skip = (page - 1) * limit;

        const countPromise = this.count(filter);
        const docsQuery = this.find(filter).sort(sortBy).skip(skip).limit(limit);
        const docsPromise = queryOptions ? docsQuery.setOptions(queryOptions).exec() : docsQuery.exec();

        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result: QueryResult<T> = {
                docs: results,
                page,
                limit,
                pages: totalPages,
                total: totalResults,
            };
            return Promise.resolve(result);
        });
    };

    public create = (doc: Partial<T>): Promise<T> => {
        const mongooseDoc = this.createModel(doc);
        return mongooseDoc.save();
    }

    public insertMany = (docs: Partial<T>[]): Promise<T[]> => {
        return this.Model.insertMany(docs as T[])
    }

    public updateById = async (id: string, doc: Partial<T>): Promise<T> => {
        const document = await this.findById(id).exec();
        if (!document) throw new DocumentNotFoundException(id);

        Object.assign(document, doc);
        return await document.save();
    }

    /**
     * Update many
     * 
     * @param filter
     * @param updateQuery
     * @returns 
     */
    public updateMany = (filter: FilterQuery<T>, updateQuery: UpdateQuery<T>): Query<any, T> => {
        return this.Model.updateMany(filter, updateQuery)
    }

    /**
     * Delete document by id
     * @param {ObjectId} userId
     * @returns {Promise<User>}
     */
    public deleteById = async (id: string): Promise<T> => {
        const document = await this.findById(id).exec();
        if (!document) throw new DocumentNotFoundException(id);

        return await document.remove();
    }

    public deleteMany = (filter: FilterQuery<T>): Query<any, T> => {
        return this.Model.deleteMany(filter)
    }

    protected getPaginateOptions = (paginateOptions?: PaginateOptions): PaginateOptions => {
        return { ...BaseService.defaultPaginateOptions, ... (paginateOptions || {}) }
    }

    private getQueryOptions = (options?: QueryOptions): QueryOptions => {
        return { ...BaseService.defaultOptions, ...(options || {}), };
    }

    private get TenantModel(): any {
        return TenantDatabases.getModelByTenant<T, any>(this.modelName, this.schema);
    }

    private static get defaultOptions(): QueryOptions {
        return { lean: false };
    }

    private static get defaultPaginateOptions(): PaginateOptions {
        return { limit: 1000, page: 1 }
    }
}