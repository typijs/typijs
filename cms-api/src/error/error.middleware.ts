import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { config } from '../config/config';
import { NodeEnv } from '../constants/enums';
import { logger } from '../logging';
import { ApiError } from './ApiError';

export class ErrorMiddleware {

    /**
     * The middleware to handler error
     */
    public errorHandler = () => (error: any, req: Request, res: Response, next: NextFunction) => {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        const apiError = new ApiError(statusCode, message, error.stack);

        const formattedMessage = `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
        logger.error(formattedMessage, apiError);

        const response = {
            statusCode,
            message,
            ...(config.app.env === NodeEnv.Development && { stack: apiError.stack })
        }

        res.status(statusCode).send(response);
    }
}

export const errorMiddleware = new ErrorMiddleware();