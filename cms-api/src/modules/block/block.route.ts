import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { requiredAdminOrEditor } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { AuthGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { createFolder, requiredParentId, updateFolderName } from '../folder/folder.validation';
import { BlockController } from './block.controller';
import { LanguageGuard } from '../language';

@Injectable()
export class BlockRouter {
    constructor(private blockController: BlockController, private authGuard: AuthGuard, private langGuard: LanguageGuard) { }

    get router(): Router {
        const block: Router = asyncRouterErrorHandler(Router());

        block.get('/folders/:parentId?', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.blockController.getFoldersByParentId);

        block.get('/children/:parentId?', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.langGuard.checkEnabled(), this.blockController.getContentsByFolder);

        block.post('/folder', this.authGuard.checkRoles(requiredAdminOrEditor), validate(createFolder), this.blockController.createFolderContent);

        block.put('/folder/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(updateFolderName), this.blockController.updateFolderName);

        block.get('/simple/:id', validate(requiredContentId), this.langGuard.checkEnabled(), this.blockController.getSimpleContent);

        block.post('/cut', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.blockController.cut);

        block.post('/copy', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.blockController.copy);

        block.post('/', this.authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), this.langGuard.checkEnabled(), this.blockController.create);

        //move to trash
        block.put('/trash/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.moveToTrash);

        block.delete('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.delete);
        return block
    }

    get versionRouter(): Router {
        const blockVersion: Router = asyncRouterErrorHandler(Router());
        //get all versions of content
        blockVersion.get('/list/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.getAllVersionsOfContent);
        //get version detail
        blockVersion.get('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.blockController.getVersion);
        //update version
        blockVersion.put('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.updateVersion);
        //set version is primary
        blockVersion.put('/set-primary/:versionId', this.authGuard.checkRoles(requiredAdminOrEditor), this.blockController.setVersionIsPrimary);
        //publish version
        blockVersion.put('/publish/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.publishVersion);
        //delete version
        blockVersion.delete('/:versionId', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.delete)
        return blockVersion;
    }
}