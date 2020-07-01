import { Router } from 'express';
import { ReflectiveInjector } from 'injection-js';

import { requiredAdminOrEditor } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, requiredContentId } from '../content/content.validation';
import { createFolder, requiredParentId, updateFolderName } from '../folder/folder.validation';
import { BaseRouter } from '../shared/base.route';
import { MediaController } from './media.controller';
import { getMediaById } from './media.validation';

export class MediaRouter extends BaseRouter {
    constructor(injector: ReflectiveInjector) {
        super(injector);
    }

    protected getRouter(): Router {
        const media: Router = asyncRouterHandler(Router());
        const mediaController = <MediaController>this.injector.get(MediaController);

        media.get('/folders/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), mediaController.getFoldersByParentId);

        media.get('/children/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), mediaController.getContentsByFolder);

        media.post('/folder', authGuard.checkRoles(requiredAdminOrEditor), validate(createFolder), mediaController.createFolderContent);

        media.put('/folder/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(updateFolderName), mediaController.updateFolderName);

        media.post('/upload/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), mediaController.storeMediaInDisk('file'), mediaController.processMedia)

        media.post('/cut', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), mediaController.cut);

        media.post('/copy', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), mediaController.copy);

        media.get('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), mediaController.get);

        media.delete('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), mediaController.delete);
        return media
    }
}

export class AssetRouter extends BaseRouter {
    constructor(injector: ReflectiveInjector) {
        super(injector);
    }

    protected getRouter(): Router {
        const asset: Router = Router();
        const mediaController = <MediaController>this.injector.get(MediaController);
        asset.get('/:fileId/:fileName', validate(getMediaById), mediaController.getMediaById);
        return asset;
    }
}