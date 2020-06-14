import { Router } from 'express';

import { asyncRouterHandler } from '../../errorHandling';
import { injector } from '../../injector';
import { validate } from '../../validation/validate.middleware';
import { AuthController } from './auth.controller';
import * as authValidation from './auth.validation';


const authRouter: Router = asyncRouterHandler(Router());
const authController = <AuthController>injector.get(AuthController);

authRouter.post('/register', validate(authValidation.register), authController.register);
authRouter.post('/login', validate(authValidation.login), authController.login);
authRouter.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
authRouter.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
authRouter.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

export { authRouter };
