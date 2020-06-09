import * as Joi from '@hapi/joi';

import { RequestSchema } from '../../validation/requestSchema';

const parentFolderId = Joi.string().required();
const folderName = Joi.string().required();

export const requiredParentId: RequestSchema = {
    params: Joi.object().keys({
        parentId: parentFolderId
    })
}

export const updateFolderName: RequestSchema = {
    params: Joi.object().keys({
        parentId: parentFolderId
    }),
    body: Joi.object().keys({
        name: folderName
    })
}

export const createFolder: RequestSchema = {
    body: Joi.object().keys({
        name: folderName
    })
}