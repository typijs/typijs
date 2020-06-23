import { Router } from 'express';

import { Roles } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { requiredId } from '../shared/base.validation';
import { UserController } from './user.controller';
import { createAdminUser, createUser, updateUser } from './user.validation';


const user: Router = asyncRouterHandler(Router());
const userController = <UserController>injector.get(UserController);

user.get('/paginate', authGuard.checkRoles([Roles.Admin]), userController.getUsers);
//get user by Id
user.get('/:id', authGuard.checkAuthenticated(), validate(requiredId), userController.get);
//create user
user.post('/', validate(createUser), userController.create);
user.post('/admin', validate(createAdminUser), userController.createAdminUser);
//update user by id
user.put('/:id', authGuard.checkAuthenticated(), validate(updateUser), userController.update);
//delete user by id
user.delete('/:id', authGuard.checkAuthenticated(), validate(requiredId), userController.delete);

export { user };

