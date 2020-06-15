import { Router } from 'express';

import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validate.middleware';
import { createUser } from '../user/user.validation';
import { AuthController } from './auth.controller';
import * as authValidation from './auth.validation';

const authRouter: Router = asyncRouterHandler(Router());
const authController = <AuthController>injector.get(AuthController);

authRouter.post('/register', validate(createUser), authController.register);
authRouter.post('/login', validate(authValidation.login), authController.login);
authRouter.post('/refresh-tokens', authController.refreshTokens);
authRouter.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
authRouter.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

export { authRouter };

