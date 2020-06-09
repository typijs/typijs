import * as httpStatus from 'http-status';
import { Exception } from './Exception';

export class DocumentNotFoundException extends Exception {
    constructor(documentId: string) {
        super(httpStatus.NOT_FOUND, `The Document with id ${documentId} is not found`);
    }
}