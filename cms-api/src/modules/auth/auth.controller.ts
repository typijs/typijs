import * as express from 'express';
import * as  httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { TokenDto } from './token.model';

@Injectable()
export class AuthController {

    private readonly refreshTokenCookie: string = 'refreshToken';
    constructor(private authService: AuthService, private userService: UserService, private tokenService: TokenService) { }

    public register = async (req: express.Request, res: express.Response) => {
        const user = await this.userService.create(req.body);
        const tokens = await this.tokenService.generateAuthTokens(user);
        this.setRefreshTokenCookie(res, tokens.refresh);
        res.status(httpStatus.CREATED).send({ ...user.toJSON(), ...tokens.access });
    };

    public login = async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;
        const user = await this.authService.loginUserWithUsernameAndPassword(username, password);
        const tokens = await this.tokenService.generateAuthTokens(user);
        this.setRefreshTokenCookie(res, tokens.refresh);
        res.status(httpStatus.OK).json({ ...user.toJSON(), ...tokens.access });
    };

    public refreshTokens = async (req: express.Request, res: express.Response) => {
        const refreshToken = req.cookies[this.refreshTokenCookie];
        if (refreshToken) {
            const tokens = await this.authService.refreshAuth(refreshToken);
            this.setRefreshTokenCookie(res, tokens.refresh);
            res.status(httpStatus.OK).json(tokens.access);
        } else {
            res.status(httpStatus.OK).json();
        }
    };

    private setRefreshTokenCookie = (res: express.Response, refreshToken: TokenDto) => {
        let options: express.CookieOptions = {
            maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 30 days
            httpOnly: true, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
        }
        res.cookie(this.refreshTokenCookie, refreshToken.token, options);
    }

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