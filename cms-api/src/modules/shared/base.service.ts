import * as mongoose from 'mongoose';

export class BaseService<T extends mongoose.Document> {

    private mongooseModel: mongoose.Model<T>;

    constructor(mongooseModel: mongoose.Model<T>) {
        this.mongooseModel = mongooseModel;
    }

    public createModel = (doc: Partial<T>): T => {
        const modelInstance = new this.mongooseModel(doc);
        return Object.assign(modelInstance, doc);
    }

    public getById = (id: string): Promise<T> => {
        if (!id) id = null;
        const content = await this.mongooseModel.findOne({ _id: id }).exec();
        return content ? content : null;
    }
}