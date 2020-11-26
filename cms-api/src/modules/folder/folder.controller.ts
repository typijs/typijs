import * as express from 'express';
import * as httpStatus from 'http-status';
import * as Joi from '@hapi/joi';

import { IContentDocument, IContentLanguageDocument } from '../content/content.model';
import { FolderService } from './folder.service';
import { BaseController } from '../shared/base.controller';
import { ValidateBody } from '../../validation/validate.decorator';
import { Authorize } from '../auth/auth.decorator';
import { AdminOrEditor } from '../../constants';

export abstract class FolderController<T extends IContentDocument, P extends IContentLanguageDocument> extends BaseController<T>  {

    constructor(private folderService: FolderService<T, P>) {
        super(folderService);
    }

    @Authorize({ roles: AdminOrEditor })
    @ValidateBody({ name: Joi.string().required() })
    async createFolderContent(req: express.Request, res: express.Response) {
        const user = req['user'];
        const item = await this.folderService.createContentFolder(req.body, user.id);
        res.status(httpStatus.OK).json(item)
    }

    @Authorize({ roles: AdminOrEditor })
    @ValidateBody({ name: Joi.string().required() })
    async updateFolderName(req: express.Request, res: express.Response) {
        const user = req['user'];
        const item = await this.folderService.updateFolderName(req.params.id, req.body.name, user.id);
        res.status(httpStatus.OK).json(item)
    }

    @Authorize()
    async getFoldersByParentId(req: express.Request, res: express.Response) {
        const items = await this.folderService.getFolderChildren(req.params.parentId)
        res.status(httpStatus.OK).json(items)
    }

    @Authorize()
    async getContentsByFolder(req: express.Request, res: express.Response) {
        const { language } = req as any;
        const items = await this.folderService.getContentChildren(req.params.parentId, language);
        res.status(httpStatus.OK).json(items)
    }
}
