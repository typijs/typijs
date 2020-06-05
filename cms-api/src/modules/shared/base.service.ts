import { PaginateOptions, PaginateResult } from '../../db/plugins/paginate';
import { DocumentNotFoundException } from '../../errorHandling';
import { IBaseDocument, IBaseModel, FilterQuery } from './base.model';

export class BaseService<T extends IBaseDocument> {

    protected mongooseModel: IBaseModel<T>;

    constructor(mongooseModel: IBaseModel<T>) {
        this.mongooseModel = mongooseModel;
    }

    public createModel = (doc: Partial<T>): T => {
        const modelInstance = new this.mongooseModel(doc);
        return Object.assign(modelInstance, doc);
    }

    public getById = (id: string): Promise<T> => {
        if (!id) id = null;
        return this.mongooseModel.findOne({ _id: id }).exec();
    }

    public find = (filter: FilterQuery): Promise<T[]> => {
        return this.mongooseModel.find(filter).exec();
    }

    public getAll = (): Promise<T[]> => {
        return this.find({});
    }

    public count = (filter: FilterQuery): Promise<number> => {
        return this.mongooseModel.countDocuments(filter).exec()
    }

    public exists = (filter: FilterQuery): Promise<boolean> => {
        return this.mongooseModel.exists(filter)
    }

    /**
     * Query for document support paging
     * @param {Object} filter - Mongo Query - https://docs.mongodb.com/manual/tutorial/query-documents/
     * @param {Object} options - Query options
     * @returns {Promise<PaginateResult>}
     */
    public queryDocuments = (filter: FilterQuery, options?: PaginateOptions): Promise<PaginateResult> => {
        return this.mongooseModel.paginate(filter, options);
    };

    public create = (doc: T): Promise<T> => {
        return this.mongooseModel.create(doc)
    }

    public updateById = async (id: string, doc: T): Promise<T> => {
        const document = await this.getById(id);
        if (!document) throw new DocumentNotFoundException(id);

        Object.assign(document, doc);
        return await document.save();
    }

    /**
     * Delete document by id
     * @param {ObjectId} userId
     * @returns {Promise<User>}
     */
    public deleteById = async (id: string): Promise<T> => {
        const document = await this.getById(id);
        if (!document) throw new DocumentNotFoundException(id);

        return await document.remove();
    }
}