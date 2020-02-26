import { Router } from 'express';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

const block: Router = Router();
const blockService: BlockService = new BlockService();
const blockController = new BlockController(blockService);

block.get('/folders/:parentId?', blockController.getFoldersByParentId);

block.get('/children/:parentId?', blockController.getContentsByFolder);

block.post('/folder', blockController.createFolderContent);

block.put('/folder/:id', blockController.updateFolderName);

block.get('/:id', blockController.get);

block.post('/cut', blockController.cut);

block.post('/copy', blockController.copy);

block.post('/', blockController.insert);

block.put('/:id', blockController.update);

block.delete('/:id', blockController.delete);

export { block };