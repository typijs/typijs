import { Router } from 'express';
import { PageCtrl } from './page.controller';

const page: Router = Router();
const controller = new PageCtrl();

page.get('/:id', controller.get);

page.get('/get-data', controller.getByUrl);

page.get('/get-children/:parentId', controller.getAllByParentId);

page.post('/', controller.insert);

page.put('/:id', controller.update);

export { page };