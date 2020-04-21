import { NextFunction, Request, Response } from 'express';

import { CONFIG } from '../config/config';
import { NodeEnv } from '../constants/enums';
import { logger } from '../logging';
import { AppError } from './AppError';

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  const { statusCode, message } = err;
  Object.assign(err, { message: `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}` });
  logger.error(err);

  const response = {
    code: statusCode,
    message,
    ...(CONFIG.APP.ENV === NodeEnv.Development && { stack: err.stack })
  }

  res.status(statusCode).send(response);
}
