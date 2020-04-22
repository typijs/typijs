import { Router } from 'express';
import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { PageController } from './page.controller';

const page: Router = asyncRouterHandler(Router());
const pageController = <PageController>injector.get(PageController);

//get published children of page
page.get('/published/children/:parentId', pageController.getPublishedPageChildren);
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
