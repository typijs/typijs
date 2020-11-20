import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { requiredAdminOrEditor } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { AuthGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, requiredContentId } from '../content/content.validation';
import { createFolder, requiredParentId, updateFolderName } from '../folder/folder.validation';
import { MediaController } from './media.controller';
import { getMediaById } from './media.validation';
import { LanguageGuard } from '../language';

@Injectable()
export class MediaRouter {
    constructor(private mediaController: MediaController, private authGuard: AuthGuard, private langGuard: LanguageGuard) { }

    get router(): Router {
        const media: Router = asyncRouterErrorHandler(Router());

        media.get('/folders/:parentId?', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.mediaController.getFoldersByParentId);

        media.get('/children/:parentId?', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.langGuard.checkEnabled(), this.mediaController.getContentsByFolder);

        media.post('/folder', this.authGuard.checkRoles(requiredAdminOrEditor), validate(createFolder), this.mediaController.createFolderContent);

        media.put('/folder/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(updateFolderName), this.mediaController.updateFolderName);

        media.get('/simple/:id', validate(requiredContentId), this.langGuard.checkEnabled(), this.mediaController.getSimpleContent);

        media.post('/upload/:parentId?', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.mediaController.handleFormData('file'), this.langGuard.checkEnabled(), this.mediaController.processMedia)

        media.post('/cut', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.mediaController.cut);

        media.post('/copy', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.mediaController.copy);

        //TODO need to revisit
        media.get('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.mediaController.getVersion);
        //move to trash
        media.put('/trash/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.mediaController.moveToTrash);

        media.delete('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.mediaController.delete);
        return media
    }

    get assetRouter(): Router {
        const asset: Router = asyncRouterErrorHandler(Router());
        asset.get('/:fileId/:fileName', validate(getMediaById), this.mediaController.getMediaById);
        return asset;
    }
}