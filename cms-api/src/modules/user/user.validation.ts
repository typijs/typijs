import * as Joi from '@hapi/joi';
import { RequestSchema } from "../../validation/requestSchema";
import { requiredId } from '../shared/base.validation';

export const createUser: RequestSchema = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).required().strict(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
    })
}

export const updateUser: RequestSchema = {
    ...requiredId,
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().lowercase().required(),
    })
}

export const changePassword: RequestSchema = {
    body: Joi.object().keys({
        oldPassword: Joi.string().min(8).required().strict(),
        password: Joi.string().min(8).required().strict(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
    })
}