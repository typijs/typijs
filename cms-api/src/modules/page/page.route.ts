import { Router } from 'express';
import { PageCtrl } from './page.controller';

const page: Router = Router();
const controller = new PageCtrl();

page.get('/:id', controller.get);

page.get('/published', controller.getByUrl);

page.get('/children/:parentId', controller.getPageChildren);

page.post('/', controller.insert);

page.put('/:id', controller.update);

page.delete('/:id', controller.delete)

export { page };