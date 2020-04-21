import { Router } from 'express';
import { injector } from '../../injector';
import { MediaController } from './media.controller';

const media: Router = Router();
const mediaController = <MediaController>injector.get(MediaController);

media.get('/folders/:parentId?', mediaController.getFoldersByParentId);

media.post('/folder', mediaController.createFolderContent);

media.put('/folder/:id', mediaController.updateFolderName);

media.get('/children/:parentId?', mediaController.getContentsByFolder);

media.post('/upload/:parentId?', mediaController.uploadMedia('file'), mediaController.processMedia)

media.post('/cut', mediaController.cut);

media.post('/copy', mediaController.copy);

media.get('/:id', mediaController.get);

media.delete('/:id', mediaController.delete);

export { media };

const asset: Router = Router();
asset.get('/:fileId/:fileName', mediaController.getMediaById);

export { asset };