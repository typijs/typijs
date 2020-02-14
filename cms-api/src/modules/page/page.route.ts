import { Router } from 'express';
import { PageService } from './page.service';
import { PageController } from './page.controller';

const page: Router = Router();
const pageService: PageService = new PageService();
const pageController = new PageController(pageService);

//get published children of page
page.get('/published/children/:parentId', pageController.getPublishedPageChildren); //query param url =??
//get published page by url
page.get('/published/:url', pageController.getByUrl); //query param url =??
//get children of page
page.get('/children/:parentId', pageController.getPageChildren);
//get page details
page.get('/:id', pageController.get);
//move page from parent to another one
page.post('/cut', pageController.cut);
//copy page from parent to another one
page.post('/copy', pageController.copy);
//create the page
page.post('/', pageController.insert);
//update pate
page.put('/:id', pageController.update);
//soft delete page
page.delete('/:id', pageController.delete)

export { page };