import * as mongoose from 'mongoose';
import { IContent } from './content.interface';

export interface IContentModel extends IContent, mongoose.Document { }

