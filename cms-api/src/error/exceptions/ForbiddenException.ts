import * as httpStatus from 'http-status';
import { Exception } from './Exception';

export class ForbiddenException extends Exception {
    constructor(message?: string) {
        super(httpStatus.FORBIDDEN, message ? message : `Forbidden!`);
    }
}