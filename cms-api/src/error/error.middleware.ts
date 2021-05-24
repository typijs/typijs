import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { ConfigManager } from '../config';
import { NodeEnv } from '../constants/enums';
import { Container } from '../injector';
import { Logger } from '../logging';
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
        Container.get(Logger).error(formattedMessage, apiError);

        const response = {
            statusCode,
            message,
            ...(ConfigManager.getEnv() === NodeEnv.Development && { stack: apiError.stack })
        }

        res.status(statusCode).send(response);
    }
}

export const errorMiddleware = new ErrorMiddleware();