import { Router } from 'express';
import { ReflectiveInjector } from 'injection-js';

import { Roles } from '../../config/roles';
import { asyncRouterHandler } from '../../errorHandling';
import { validate } from '../../validation/validate.middleware';
import { authGuard } from '../auth/auth.middleware';
import { BaseRouter } from '../shared/base.route';
import { requiredId } from '../shared/base.validation';
import { UserController } from './user.controller';
import { createAdminUser, createUser, updateUser } from './user.validation';

export class UserRouter extends BaseRouter {
    constructor(injector: ReflectiveInjector) {
        super(injector);
    }

    protected getRouter(): Router {
        const user: Router = asyncRouterHandler(Router());
        const userController = <UserController>this.injector.get(UserController);

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

        return user;
    }
}