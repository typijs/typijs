import { Router } from 'express';
import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validateMiddleware';
import { requiredParentId } from '../folder/folder.validation';
import { requiredContentId, cutOrCopyContent, insertContent } from '../content/content.validation';

import { PageController } from './page.controller';
import { requiredUrl } from './page.validation';

const page: Router = asyncRouterHandler(Router());
const pageController = <PageController>injector.get(PageController);

//get published children of page
page.get('/published/children/:parentId', validate(requiredParentId), pageController.getPublishedPageChildren);
//get published page by url
page.get('/published/:url', validate(requiredUrl), pageController.getByUrl);
//get children of page
page.get('/children/:parentId', validate(requiredParentId), pageController.getPageChildren);
//get page details
page.get('/:id', validate(requiredContentId), pageController.get);
//move page from parent to another one
page.post('/cut', validate(cutOrCopyContent), pageController.cut);
//copy page from parent to another one
page.post('/copy', validate(cutOrCopyContent), pageController.copy);
//create the page
page.post('/', validate(insertContent), pageController.insert);
//update pate
page.put('/:id', validate(requiredContentId), pageController.update);
//soft delete page
page.delete('/:id', validate(requiredContentId), pageController.delete)

export { page };
