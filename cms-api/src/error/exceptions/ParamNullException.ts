import * as httpStatus from 'http-status';
import { Exception } from './Exception';

export class ParamNullException extends Exception {
    constructor(paramName: string) {
        super(httpStatus.BAD_REQUEST, `The param ${paramName} must have value`);
    }
}