import { Router } from 'express';
import { MediaCtrl } from './media.controller';

const media: Router = Router();
const controller = new MediaCtrl();

media.get('/:id', controller.get);

media.get('/folders/:parentId?', controller.getFoldersByParentId);

media.get('/get-by-folder/:parentId?', controller.getMediasByFolder);

media.post('/', controller.insert);

media.post('/upload/:parentId?', controller.uploadMedia('file'), controller.processMedia)

media.put('/:id', controller.update);

media.delete('/:id', controller.update);

export { media };

const asset: Router = Router();
asset.get('/:fileId/:fileName', controller.getMediaById);

export { asset };