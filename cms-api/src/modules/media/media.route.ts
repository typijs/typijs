import { Router } from 'express';
import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validate.middleware';
import { requiredParentId, updateFolderName, createFolder } from '../folder/folder.validation';
import { requiredContentId, cutOrCopyContent } from '../content/content.validation';
import { MediaController } from './media.controller';
import { getMediaById } from './media.validation';

const media: Router = asyncRouterHandler(Router());
const mediaController = <MediaController>injector.get(MediaController);

media.get('/folders/:parentId?', validate(requiredParentId), mediaController.getFoldersByParentId);

media.get('/children/:parentId?', validate(requiredParentId), mediaController.getContentsByFolder);

media.post('/folder', validate(createFolder), mediaController.createFolderContent);

media.put('/folder/:id', validate(updateFolderName), mediaController.updateFolderName);

media.post('/upload/:parentId?', validate(requiredParentId), mediaController.storeMediaInDisk('file'), mediaController.processMedia)

media.post('/cut', validate(cutOrCopyContent), mediaController.cut);

media.post('/copy', validate(cutOrCopyContent), mediaController.copy);

media.get('/:id', validate(requiredContentId), mediaController.get);

media.delete('/:id', validate(requiredContentId), mediaController.delete);

export { media };

const asset: Router = Router();
asset.get('/:fileId/:fileName', validate(getMediaById), mediaController.getMediaById);

export { asset };