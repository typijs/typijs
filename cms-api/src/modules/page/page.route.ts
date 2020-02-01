import { Router } from 'express';
import { PageService } from './page.service';
import { PageController } from './page.controller';

const page: Router = Router();
const pageService: PageService = new PageService();
const pageController = new PageController(pageService);

page.get('/published/:url', pageController.getByUrl); //query param url =??

page.get('/children/:parentId', pageController.getPageChildren);

page.get('/:id', pageController.get);

page.post('/cut', pageController.cut);

page.post('/copy', pageController.copy);

page.post('/', pageController.insert);

page.put('/:id', pageController.update);

page.delete('/:id', pageController.delete)

export { page };