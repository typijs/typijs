import { Router } from 'express';

import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validateMiddleware';
import { UserController } from './user.controller';

const user: Router = asyncRouterHandler(Router());
const userController = <UserController>injector.get(UserController);

user.get('/:id', userController.get);

user.post('/', userController.insert);

user.put('/:id', userController.update);

user.delete('/:id', userController.delete);

export { user };

