import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { AppError } from './AppError';

/**
 * Convert error object if it is not AppError instance
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export function errorConverter(error: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    next(new AppError(statusCode, message, error.stack));
}
