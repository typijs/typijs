import { Router } from 'express';
import { ReflectiveInjector } from 'injection-js';

import { asyncRouterHandler } from '../../errorHandling';
import { validate } from '../../validation/validate.middleware';
import { BaseRouter } from '../shared/base.route';
import { createUser } from '../user/user.validation';
import { AuthController } from './auth.controller';
import * as authValidation from './auth.validation';

export class AuthRouter extends BaseRouter {
    constructor(injector: ReflectiveInjector) {
        super(injector);
    }

    protected getRouter(): Router {
        const authRouter: Router = asyncRouterHandler(Router());
        const authController = <AuthController>this.injector.get(AuthController);

        authRouter.post('/register', validate(createUser), authController.register);
        authRouter.post('/login', validate(authValidation.login), authController.login);
        authRouter.post('/refresh-token', authController.refreshTokens);
        authRouter.post('/revoke-token', authController.revokeToken);
        authRouter.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
        authRouter.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
        return authRouter
    }
}
