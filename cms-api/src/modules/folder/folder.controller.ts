import * as express from 'express';
import * as mongoose from 'mongoose';

import { IContentDocument } from '../content/content.model';
import { FolderService } from './folder.service';

export abstract class FolderCtrl<T extends IContentDocument> {
    private folderService: FolderService<T>;

    constructor(contentModel: mongoose.Model<T>) {
        this.folderService = new FolderService(contentModel);
    }

    //Create new folder
    createFolderContent = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const contentFolder = this.folderService.createModelInstance(req.body);

        //get parent folder
        this.folderService.createContentFolder(contentFolder)
            .then(item => res.status(200).json(item))
            .catch(err => next(err))
    }

    updateFolderName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const contentFolder = this.folderService.createModelInstance(req.body);

        this.folderService.updateFolderName(req.params.id, contentFolder.name)
            .then(item => res.status(200).json(item))
            .catch(err => next(err));
    }

    getFoldersByParentId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.folderService.getFolderChildren(req.params.parentId)
            .then(items => res.status(200).json(items))
            .catch(err => next(err))
    }

    getContentsByFolder = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.folderService.getContentsByFolder(req.params.parentId)
            .then(items => res.status(200).json(items))
            .catch(err => next(err))
    }

}
