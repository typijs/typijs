import * as Joi from '@hapi/joi';
import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errorHandling/ApiError';
import { pick } from '../utils/pick';
import { RequestSchema } from './requestSchema';

export const validate = (schema: RequestSchema, options?: Joi.ValidationOptions) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    // Joi validation options
    const defaultOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true // remove unknown keys from the validated data
    };
    const validationOptions: Joi.ValidationOptions = Object.assign(defaultOptions, options || {});

    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object, validationOptions);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
};