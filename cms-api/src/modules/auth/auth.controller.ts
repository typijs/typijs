import * as express from 'express';
import * as  httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthController {

    constructor(private authService: AuthService, private userService: UserService, private tokenService: TokenService) { }

    public register = async (req: express.Request, res: express.Response) => {
        const user = await this.userService.create(req.body);
        const tokens = await this.tokenService.generateAuthTokens(user);
        res.status(httpStatus.CREATED).send({ user, tokens });
    };

    public login = async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;
        const user = await this.authService.loginUserWithUsernameAndPassword(username, password);
        const tokens = await this.tokenService.generateAuthTokens(user);
        res.send({ user, tokens });
    };

    public refreshTokens = async (req: express.Request, res: express.Response) => {
        const tokens = await this.authService.refreshAuth(req.body.refreshToken);
        res.send({ ...tokens });
    };

    public forgotPassword = async (req: express.Request, res: express.Response) => {
        const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
        //TODO await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
        res.status(httpStatus.NO_CONTENT).send();
    };

    public resetPassword = async (req: express.Request, res: express.Response) => {
        await this.authService.resetPassword(req.query.token, req.body.password);
        res.status(httpStatus.NO_CONTENT).send();
    };
}