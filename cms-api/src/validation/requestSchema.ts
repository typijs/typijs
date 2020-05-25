import * as Joi from '@hapi/joi';

export type RequestSchema = {
    params?: Joi.ObjectSchema<any>
    body?: Joi.ObjectSchema<any>
    query?: Joi.ObjectSchema<any>
    [key: string]: any
}