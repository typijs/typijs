import { Router } from 'express';

import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validate.middleware';
import { requiredParentId, updateFolderName, createFolder } from '../folder/folder.validation';
import { requiredContentId, cutOrCopyContent, insertContent } from '../content/content.validation';
import { BlockController } from './block.controller';

const block: Router = asyncRouterHandler(Router());
const blockController = <BlockController>injector.get(BlockController);

block.get('/folders/:parentId?', validate(requiredParentId), blockController.getFoldersByParentId);

block.get('/children/:parentId?', validate(requiredParentId), blockController.getContentsByFolder);

block.post('/folder', validate(createFolder), blockController.createFolderContent);

block.put('/folder/:id', validate(updateFolderName), blockController.updateFolderName);

block.get('/:id', validate(requiredContentId), blockController.get);

block.post('/cut', validate(cutOrCopyContent), blockController.cut);

block.post('/copy', validate(cutOrCopyContent), blockController.copy);

block.post('/', validate(insertContent), blockController.create);

block.put('/:id', validate(requiredContentId), blockController.update);

block.delete('/:id', validate(requiredContentId), blockController.delete);

export { block };
