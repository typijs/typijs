import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { config } from '../config/config';
import { NodeEnv } from '../constants/enums';
import { logger } from '../logging';
import { ApiError } from './ApiError';

export class ErrorMiddleware {
    /**
     * The middleware to convert error object if it is not AppError instance
     * @param error 
     * @param req 
     * @param res 
     * @param next 
     */
    public errorConverter = (error: any, req: Request, res: Response, next: NextFunction) => {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        next(new ApiError(statusCode, message, error.stack));
    }

    /**
     * The middleware to handler error
     */
    public errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
        const { statusCode, message } = err;
        const formattedMessage = `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
        logger.error(formattedMessage, err);

        const response = {
            statusCode,
            message,
            ...(config.app.env === NodeEnv.Development && { stack: err.stack })
        }

        res.status(statusCode).send(response);
    }
}

export const errorMiddleware = new ErrorMiddleware();