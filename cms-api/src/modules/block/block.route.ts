import { Router } from 'express';
import { ReflectiveInjector } from 'injection-js';

import { requiredAdminOrEditor } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { cutOrCopyContent, insertContent, requiredContentId } from '../content/content.validation';
import { createFolder, requiredParentId, updateFolderName } from '../folder/folder.validation';
import { BaseRouter } from '../shared/base.route';
import { BlockController } from './block.controller';


export class BlockRouter extends BaseRouter {
    constructor(injector: ReflectiveInjector) {
        super(injector);
    }

    protected getRouter(): Router {
        const block: Router = asyncRouterHandler(Router());
        const blockController = <BlockController>this.injector.get(BlockController);

        block.get('/folders/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), blockController.getFoldersByParentId);

        block.get('/children/:parentId?', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredParentId), blockController.getContentsByFolder);

        block.post('/folder', authGuard.checkRoles(requiredAdminOrEditor), validate(createFolder), blockController.createFolderContent);

        block.put('/folder/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(updateFolderName), blockController.updateFolderName);

        block.get('/:id', validate(requiredContentId), blockController.get);

        block.post('/cut', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), blockController.cut);

        block.post('/copy', authGuard.checkRoles(requiredAdminOrEditor), validate(cutOrCopyContent), blockController.copy);

        block.post('/', authGuard.checkRoles(requiredAdminOrEditor), validate(insertContent), blockController.create);

        block.put('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), blockController.update);

        block.delete('/:id', authGuard.checkRoles(requiredAdminOrEditor), validate(requiredContentId), blockController.delete);
        return block
    }
}