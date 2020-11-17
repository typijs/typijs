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
        //get all versions of content
        block.get('/version/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.getAllVersionsOfContent);
        //set version is primary
        block.put('/version/:versionId', this.authGuard.checkRoles(requiredAdminOrEditor), this.blockController.setVersionIsPrimary);

        block.get('/:id', validate(requiredContentId), this.langGuard.checkEnabled(), this.blockController.get);

        block.post('/cut', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.blockController.cut);

        block.post('/copy', this.authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.blockController.copy);

        block.post('/', this.authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), this.langGuard.checkEnabled(), this.blockController.create);

        block.put('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.blockController.update);
        //publish page
        block.put('/publish/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.langGuard.checkEnabled(), this.blockController.publish);
        //move to trash
        block.put('/trash/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.moveToTrash);

        block.delete('/:id', this.authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.delete);
        return block
    }
}