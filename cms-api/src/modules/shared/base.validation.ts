import * as Joi from '@hapi/joi';
import { RequestSchema } from "../../validation/requestSchema";

export const requiredId: RequestSchema = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}