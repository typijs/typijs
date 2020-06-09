import * as Joi from '@hapi/joi';

import { RequestSchema } from '../../validation/requestSchema';

export const requiredUrl: RequestSchema = {
    params: Joi.object().keys({
        url: Joi.string().required()
    })
}