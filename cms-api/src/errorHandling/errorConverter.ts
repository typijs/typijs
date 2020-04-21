import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { AppError } from './AppError';

export function errorConverter(error: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    next(new AppError(statusCode, message, error.stack));
}
