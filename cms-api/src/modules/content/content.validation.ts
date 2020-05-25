import * as Joi from '@hapi/joi';

import { RequestSchema } from '../../validation/requestSchema';

const contentId = Joi.string().required();

export const requiredContentId: RequestSchema = {
    params: Joi.object().keys({
        id: contentId
    })
}

export const cutOrCopyContent: RequestSchema = {
    body: Joi.object().keys({
        sourceContentId: Joi.string().required(),
        targetParentId: Joi.string().required()
    })
}

export const insertContent: RequestSchema = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        //parentId: Joi.string().required(),
        contentType: Joi.string().required()
    })
}