import { Router } from 'express';
import { BlockCtrl } from './block.controller';

const block: Router = Router();
const controller = new BlockCtrl();

block.get('/folders/:parentId?', controller.getFoldersByParentId);

block.get('/children/:parentId?', controller.getContentsByFolder);

block.post('/folder', controller.createFolderContent);

block.put('/folder/:id', controller.updateFolderName);

block.get('/:id', controller.get);

block.post('/', controller.insert);

block.put('/:id', controller.update);

block.delete('/:id', controller.delete);

export { block };