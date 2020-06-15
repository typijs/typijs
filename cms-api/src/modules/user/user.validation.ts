import * as Joi from '@hapi/joi';
import { RequestSchema } from "../../validation/requestSchema";
import { password } from '../../validation/custom';
import { requiredId } from '../shared/base.validation';

const userSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required().strict().custom(password),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
}

export const createUser: RequestSchema = {
    body: Joi.object().keys(userSchema)
}

export const createAdminUser: RequestSchema = {
    body: Joi.object().keys({ ...userSchema, ...({ username: Joi.string().valid('admin').required() }) })
}

export const updateUser: RequestSchema = {
    ...requiredId,
    ...({
        body: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().lowercase().required()
        })
    })
}

export const changePassword: RequestSchema = {
    body: Joi.object().keys({
        oldPassword: Joi.string().min(8).required().strict(),
        password: Joi.string().min(8).required().strict().custom(password),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
    })
}