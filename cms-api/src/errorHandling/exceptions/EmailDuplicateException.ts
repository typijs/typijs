import * as httpStatus from 'http-status';
import { Exception } from './Exception';

export class EmailDuplicateException extends Exception {
    constructor(email: string) {
        super(httpStatus.BAD_REQUEST, `Email ${email} already taken`);
    }
}