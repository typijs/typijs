import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { requiredAdminOrEditor } from '../../config/roles';
import { asyncRouterHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, requiredContentId } from '../content/content.validation';
import { createFolder, requiredParentId, updateFolderName } from '../folder/folder.validation';
import { MediaController } from './media.controller';
import { getMediaById } from './media.validation';

@Injectable()
export class MediaRouter{
    constructor(private mediaController: MediaController) {}

    get router(): Router {
        const media: Router = asyncRouterHandler(Router());

        media.get('/folders/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.mediaController.getFoldersByParentId);

        media.get('/children/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.mediaController.getContentsByFolder);

        media.post('/folder', authGuard.checkRoles(requiredAdminOrEditor), validate(createFolder), this.mediaController.createFolderContent);

        media.put('/folder/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(updateFolderName), this.mediaController.updateFolderName);

        media.post('/upload/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.mediaController.storeMediaInDisk('file'), this.mediaController.processMedia)

        media.post('/cut', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.mediaController.cut);

        media.post('/copy', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.mediaController.copy);

        media.get('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.mediaController.get);

        media.delete('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.mediaController.delete);
        return media
    }
}

@Injectable()
export class AssetRouter {
    constructor(private mediaController: MediaController) {}

    get router(): Router {
        const asset: Router = asyncRouterHandler(Router());
        asset.get('/:fileId/:fileName', validate(getMediaById), this.mediaController.getMediaById);
        return asset;
    }
}