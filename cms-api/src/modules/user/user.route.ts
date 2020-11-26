import 'reflect-metadata';
import { Router } from 'express';
import { Injectable } from 'injection-js';

import { Roles } from '../../constants/roles';
import { asyncRouterErrorHandler } from '../../error';
import { validate } from '../../validation/validate.middleware';
import { AuthGuard } from '../auth/auth.middleware';
import { requiredId } from '../shared/base.validation';
import { UserController } from './user.controller';
import { createAdminUser, createUser, updateUser } from './user.validation';

@Injectable()
export class UserRouter {
    constructor(private userController: UserController, private authGuard: AuthGuard) { }

    get router(): Router {
        const user: Router = asyncRouterErrorHandler(Router());

        // action by admin user
        user.get('/paginate', this.authGuard.checkRoles([Roles.Admin]), this.userController.getUsers);
        user.post('/create', this.authGuard.checkRoles([Roles.Admin]), this.userController.createUser);
        user.put('/edit', this.authGuard.checkRoles([Roles.Admin]), this.userController.update);
        user.delete('/delete', this.authGuard.checkRoles([Roles.Admin]), this.userController.delete);
        //get user by Id
        user.get('/:id', this.authGuard.checkAuthenticated(), validate(requiredId), this.userController.get);
        //create user
        user.post('/', validate(createUser), this.userController.createUser);
        user.post('/admin', validate(createAdminUser), this.userController.createAdminUser);
        //update user by id
        user.put('/:id', this.authGuard.checkAuthenticated(), validate(updateUser), this.userController.updateUser);

        return user;
    }
}