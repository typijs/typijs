import { Router } from 'express';
import { PageCtrl } from './page.controller';

const page: Router = Router();
const controller = new PageCtrl();

page.get('/published/:url', controller.getByUrl); //query param url =??

page.get('/children/:parentId', controller.getPageChildren);

page.get('/:id', controller.get);

page.post('/', controller.insert);

page.put('/:id', controller.update);

page.delete('/:id', controller.delete)

export { page };