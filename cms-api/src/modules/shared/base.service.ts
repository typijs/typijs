import * as mongoose from 'mongoose';
import { NotFoundException } from '../../errorHandling';

export class BaseService<T extends mongoose.Document> {

    private mongooseModel: mongoose.Model<T>;

    constructor(mongooseModel: mongoose.Model<T>) {
        this.mongooseModel = mongooseModel;
    }

    public createModelInstance = (doc: any): T => new this.mongooseModel(doc);

    public getModelById = (id: string): Promise<T> => {
        if (!id) id = null;

        return this.mongooseModel.findOne({ _id: id }).exec()
            .then((content: T) => {
                if (!content) throw new NotFoundException(id);
                return content;
            });
    }
}