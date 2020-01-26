import { Router } from 'express';
import { MediaCtrl } from './media.controller';

const media: Router = Router();
const controller = new MediaCtrl();

media.get('/folders/:parentId?', controller.getFoldersByParentId);

media.post('/folder', controller.createFolderContent);

media.put('/folder/:id', controller.updateFolderName);

media.get('/children/:parentId?', controller.getContentsByFolder);

media.post('/upload/:parentId?', controller.uploadMedia('file'), controller.processMedia)

media.get('/:id', controller.get);

media.delete('/:id', controller.delete);

export { media };

const asset: Router = Router();
asset.get('/:fileId/:fileName', controller.getMediaById);

export { asset };