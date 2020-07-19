import * as httpStatus from 'http-status';
import { Exception } from './Exception';

export class DocumentNotFoundException extends Exception {
    constructor(documentId: string, message?: string) {
        super(httpStatus.NOT_FOUND, message ? message : `The Document with id ${documentId} is not found`);
    }
}