import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { Roles } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { requiredId } from '../shared/base.validation';
import { UserController } from './user.controller';
import { createAdminUser, createUser, updateUser } from './user.validation';

@Injectable()
export class UserRouter {
    constructor(private userController: UserController) {}

    get router(): Router {
        const user: Router = asyncRouterHandler(Router());

        user.get('/paginate', authGuard.checkRoles([Roles.Admin]), this.userController.getUsers);
        //get user by Id
        user.get('/:id', authGuard.checkAuthenticated(), validate(requiredId), this.userController.get);
        //create user
        user.post('/', validate(createUser), this.userController.create);
        user.post('/admin', validate(createAdminUser), this.userController.createAdminUser);
        //update user by id
        user.put('/:id', authGuard.checkAuthenticated(), validate(updateUser), this.userController.update);
        //delete user by id
        user.delete('/:id', authGuard.checkAuthenticated(), validate(requiredId), this.userController.delete);

        return user;
    }
}