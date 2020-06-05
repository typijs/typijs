import { Document, Model } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../db/plugins/paginate';

export type FilterQuery = {
    [key: string]: any;
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
export interface IBaseModel<T extends IBaseDocument> extends Model<T> {
    //Should defined the static methods here
    paginate(filter: FilterQuery, options?: PaginateOptions): Promise<PaginateResult>;
}