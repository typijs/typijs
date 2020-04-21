import { HttpException } from './HttpException';

export class DocumentNotFoundException extends HttpException {
    constructor(documentId: string) {
        super(404, `The Document with id ${documentId} is not found`);
    }
}