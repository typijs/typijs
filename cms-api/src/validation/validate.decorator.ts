import 'reflect-metadata';
import * as Joi from '@hapi/joi';
import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../error';
import { Validator } from './validator';

/**
 * Validate the request
 * @param joiSchema The validation model schema
 * @param key The request's property name
 */
export function ValidateRequest(joiSchema: { [property: string]: Joi.Schema }, key: 'params' | 'body' | 'query' | string) {
    Validator.throwIfNullOrEmpty('key', key);
    const validateSchema = Joi.object(joiSchema);
    // Joi validation options
    const validationOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true // remove unknown keys from the validated data
    };

    /**
     * @params{any} target - The prototype of the class (Object).
     * @params{string} propertyKey - The name of the method.
     * @params{PropertyDescriptor} descriptor - Property that has a value (in that case the method)
     */
    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        // Ensure we have the descriptor that might been overriden by another decorator
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyName);
        }

        if (!descriptor || (typeof descriptor.value !== 'function')) {
            throw new TypeError(`Only methods can be decorated with @Validate${key}. <${propertyName}> is not a method!`);
        }
        // Copy
        const originalMethod = descriptor.value;
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const plain = req[key];
            const { value, error } = validateSchema.validate(plain, validationOptions);
            if (error) {
                const errorMessage = error.details.map((details) => details.message).join(', ');
                next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
                return;
            }
            Object.assign(req[key], value);
            return originalMethod.apply(this, [req, res, next]);
        };
    };
}

/**
 * Validate the request's params
 * @param joiSchema for example `{ name: Joi.string().required() }`
 */
export function ValidateParams(joiSchema: { [key: string]: Joi.Schema }) { return ValidateRequest(joiSchema, 'params'); }
/**
 * Validate the request's query
 * @param joiSchema for example `{ name: Joi.string().required() }` 
 */
export function ValidateQuery(joiSchema: { [key: string]: Joi.Schema }) { return ValidateRequest(joiSchema, 'query'); }
/**
 * Validate the request's body
 * @param joiSchema for example `{ name: Joi.string().required() }` 
 */
export function ValidateBody(joiSchema: { [key: string]: Joi.Schema }) { return ValidateRequest(joiSchema, 'body'); }