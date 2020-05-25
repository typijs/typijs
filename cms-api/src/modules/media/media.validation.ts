import * as Joi from '@hapi/joi';

import { RequestSchema } from '../../validation/requestSchema';

export const getMediaById: RequestSchema = {
    params: Joi.object().keys({
        fileId: Joi.string().required(),
        fileName: Joi.string().required()
    })
}