import { Router } from 'express';

import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validateMiddleware';
import { requiredId } from '../shared/base.validation';
import { UserController } from './user.controller';
import { createUser, updateUser } from './user.validation';

const user: Router = asyncRouterHandler(Router());
const userController = <UserController>injector.get(UserController);

user.get('/paginate', userController.getUsers);
//get user by Id
user.get('/:id', validate(requiredId), userController.get);
//create user
user.post('/', validate(createUser), userController.create);
//update user by id
user.put('/:id', validate(updateUser), userController.update);
//delete user by id
user.delete('/:id', validate(requiredId), userController.delete);

export { user };

