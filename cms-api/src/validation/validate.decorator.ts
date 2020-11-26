import 'reflect-metadata';
import * as Joi from '@hapi/joi';
import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../error';

function validationFactory(model: { [key: string]: Joi.Schema }, source: 'params' | 'body' | 'query' | string) {
    const validateSchema = Joi.object(model);
    // Joi validation options
    const validationOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true // remove unknown keys from the validated data
    };

    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        if (!descriptor || (typeof descriptor.value !== 'function')) {
            throw new TypeError(`Only methods can be decorated with @validation. <${propertyName}> is not a method!`);
        }

        const method = descriptor.value;
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const plain = req[source];
            const { value, error } = validateSchema.validate(plain, validationOptions);
            if (error) {
                const errorMessage = error.details.map((details) => details.message).join(', ');
                next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
                return;
            }
            Object.assign(req[source], value);
            return method.apply(this, [req, res, next]);
        };
    };
}

/**
 * Validate the request's params
 * @param dto 
 */
export function ValidateParams(dto: { [key: string]: Joi.Schema }) { return validationFactory(dto, 'params'); }
/**
 * Validate the request's query
 * @param dto 
 */
export function ValidateQuery(dto: { [key: string]: Joi.Schema }) { return validationFactory(dto, 'query'); }
/**
 * Validate the request's body
 * @param dto 
 */
export function ValidateBody(dto: { [key: string]: Joi.Schema }) { return validationFactory(dto, 'body'); }