import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { requiredAdminOrEditor } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { createFolder, requiredParentId, updateFolderName } from '../folder/folder.validation';
import { BlockController } from './block.controller';

@Injectable()
export class BlockRouter {
    constructor(private blockController: BlockController) { }

    get router(): Router {
        const block: Router = asyncRouterErrorHandler(Router());

        block.get('/folders/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.blockController.getFoldersByParentId);

        block.get('/children/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), this.blockController.getContentsByFolder);

        block.post('/folder', authGuard.checkRoles(requiredAdminOrEditor), validate(createFolder), this.blockController.createFolderContent);

        block.put('/folder/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(updateFolderName), this.blockController.updateFolderName);

        block.get('/:id', validate(requiredContentId), this.blockController.get);

        block.post('/cut', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.blockController.cut);

        block.post('/copy', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), this.blockController.copy);

        block.post('/', authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), this.blockController.create);

        block.put('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.update);

        block.delete('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), this.blockController.delete);
        return block
    }
}