import * as Joi from '@hapi/joi';
import { password } from '../../validation/custom';
import { RequestSchema } from '../../validation/requestSchema';

export const register: RequestSchema = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
    }),
};

export const login: RequestSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export const refreshTokens: RequestSchema = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

export const forgotPassword: RequestSchema = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

export const resetPassword: RequestSchema = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};