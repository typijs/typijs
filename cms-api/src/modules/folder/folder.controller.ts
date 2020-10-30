import * as express from 'express';
import * as httpStatus from 'http-status';

import { IContentDocument, IContentLanguageDocument } from '../content/content.model';
import { FolderService } from './folder.service';
import { BaseController } from '../shared/base.controller';

export abstract class FolderController<T extends IContentDocument, P extends IContentLanguageDocument> extends BaseController<T> {

    constructor(private folderService: FolderService<T, P>) {
        super(folderService);
    }

    //Create new folder
    createFolderContent = async (req: express.Request, res: express.Response) => {
        const user = req['user'];
        const item = await this.folderService.createContentFolder(req.body, user.id);
        res.status(httpStatus.OK).json(item)
    }

    updateFolderName = async (req: express.Request, res: express.Response) => {
        const user = req['user'];
        const item = await this.folderService.updateFolderName(req.params.id, req.body.name, user.id);
        res.status(httpStatus.OK).json(item)
    }

    getFoldersByParentId = async (req: express.Request, res: express.Response) => {
        const items = await this.folderService.getFolderChildren(req.params.parentId)
        res.status(httpStatus.OK).json(items)
    }

    getContentsByFolder = async (req: express.Request, res: express.Response) => {
        const items = await this.folderService.getContentChildren(req.params.parentId, req.query.language)
        res.status(httpStatus.OK).json(items)
    }
}
