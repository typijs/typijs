import { FilterQuery, Query, UpdateQuery } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../db/plugins/paginate';
import { DocumentNotFoundException } from '../../error';
import { IBaseDocument, IBaseModel, QueryItem, QueryList, QueryOptions } from './base.model';

export class BaseService<T extends IBaseDocument> {

    protected mongooseModel: IBaseModel<T>;
    private static get defaultOptions(): QueryOptions {
        return { lean: false };
    }

    private static get defaultPaginateOptions(): PaginateOptions {
        return { limit: 10, page: 1 }
    }

    constructor(mongooseModel: IBaseModel<T>) {
        this.mongooseModel = mongooseModel;
    }

    public get Model(): IBaseModel<T> {
        return this.mongooseModel;
    }

    /**
     * Create an instance of mongoose Model. When you use this method, you create a new document.
     * @returns the new document which is an instance of mongoose Model
     */
    public createModel = (doc: Partial<T>): T => {
        const modelInstance = new this.mongooseModel(doc);
        return Object.assign(modelInstance, doc);
    }

    /**
     * Find by id of base service
     */
    public findById = (id: string, options?: QueryOptions): QueryItem<T> => {
        if (!id) id = null;
        return this.mongooseModel.findById(id).setOptions(this.getQueryOptions(options));
    }

    public findOne = (filter: FilterQuery<T>, options?: QueryOptions): QueryItem<T> => {
        return this.mongooseModel.findOne(filter).setOptions(this.getQueryOptions(options));
    }

    public find = (filter: FilterQuery<T>, options?: QueryOptions): QueryList<T> => {
        return this.mongooseModel.find(filter).setOptions(this.getQueryOptions(options));
    }

    public getAll = (options?: QueryOptions): QueryList<T> => {
        return this.find({}, options);
    }

    public count = (filter: FilterQuery<T>): Promise<number> => {
        return this.mongooseModel.count(filter).exec()
    }

    public exists = (filter: FilterQuery<T>): Promise<boolean> => {
        return this.mongooseModel.exists(filter)
    }

    /**
     * Query for document support paging
     * @param {Object} filter - Mongo Query - https://docs.mongodb.com/manual/tutorial/query-documents/
     * @param {Object} paginateOptions - Paginate options
     * @param {Object} queryOptions - Query options
     * @returns {Promise<PaginateResult>}
     */
    public paginate = (filter: FilterQuery<T>, paginateOptions?: PaginateOptions, queryOptions?: QueryOptions): Promise<PaginateResult> => {
        const mergedPaginateOptions = { ...BaseService.defaultPaginateOptions, ... (paginateOptions || {}) }
        return this.mongooseModel.paginate(filter, mergedPaginateOptions, this.getQueryOptions(queryOptions));
    };

    public create = (doc: Partial<T>): Promise<T> => {
        const mongooseDoc = this.createModel(doc);
        return mongooseDoc.save()
    }

    public insertMany = (docs: Partial<T>[]): Promise<T[]> => {
        return this.mongooseModel.insertMany(docs)
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
    public updateMany = (filter: FilterQuery<T>, updateQuery: UpdateQuery<T>): Query<any> => {
        return this.mongooseModel.updateMany(filter, updateQuery)
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

    public deleteMany = (filter: FilterQuery<T>): Query<any> => {
        return this.mongooseModel.deleteMany(filter)
    }

    protected getQueryOptions(options?: QueryOptions) {
        const mergedOptions = { ...BaseService.defaultOptions, ...(options || {}), };
        return mergedOptions;
    }
}