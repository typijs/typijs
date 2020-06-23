import * as httpStatus from 'http-status';
import { Exception } from './Exception';

export class UnauthorizedException extends Exception {
    constructor(message?: string) {
        super(httpStatus.UNAUTHORIZED, message ? message : `You are unauthorized`);
    }
}