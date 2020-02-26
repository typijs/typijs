import { NextFunction, Request, Response } from 'express';

import { logger } from '../logging'
import { HttpException } from './exceptions';

export function errorMiddleware(err: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  err.message = `${status} - ${message} - ${request.method} - ${request.originalUrl}`;
  logger.error(``, err);

  response
    .status(status)
    .send({
      status,
      message
    });
}
