import * as express from 'express';
import * as mongoose from 'mongoose';
import * as httpStatus from 'http-status';

import { IContentDocument } from '../content/content.model';
import { FolderService } from './folder.service';

export abstract class FolderController<T extends IContentDocument> {
    private folderService: FolderService<T>;

    constructor(contentModel: mongoose.Model<T>) {
        this.folderService = new FolderService(contentModel);
    }

    //Create new folder
    createFolderContent = async (req: express.Request, res: express.Response) => {
        const contentFolder = this.folderService.createModelInstance(req.body);
        const item = await this.folderService.createContentFolder(contentFolder)
        res.status(httpStatus.OK).json(item)
    }

    updateFolderName = async (req: express.Request, res: express.Response) => {
        const contentFolder = this.folderService.createModelInstance(req.body);
        const item = await this.folderService.updateFolderName(req.params.id, contentFolder.name)
        res.status(httpStatus.OK).json(item)
    }

    getFoldersByParentId = async (req: express.Request, res: express.Response) => {
        const items = await this.folderService.getFolderChildren(req.params.parentId)
        res.status(httpStatus.OK).json(items)
    }

    getContentsByFolder = async (req: express.Request, res: express.Response) => {
        const items = this.folderService.getContentsByFolder(req.params.parentId)
        res.status(httpStatus.OK).json(items)
    }
}
