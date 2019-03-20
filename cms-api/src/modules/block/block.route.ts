import { Router } from 'express';
import { BlockCtrl } from './block.controller';

const block: Router = Router();
const controller = new BlockCtrl();

block.get('/:id', controller.get);

block.get('/folders/:parentId?', controller.getFoldersByParentId);

block.get('/get-by-folder/:parentId?', controller.getContentsByFolder);

block.post('/', controller.createContent);

block.put('/:id', controller.updateContent);

block.delete('/:id', controller.delete);

export { block };