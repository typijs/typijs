import 'reflect-metadata';
import * as express from 'express';
import * as  httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { TokenDto } from './token.model';
import { LanguageService } from '../language/language.service';
import { ILanguageBranchDocument } from '../language/language.model';

@Injectable()
export class AuthController {

    private readonly refreshTokenCookie: string = 'refreshToken';
    constructor(private authService: AuthService, private userService: UserService, private tokenService: TokenService, private languageService: LanguageService) { }

    public canSetupAdmin = async (req: express.Request, res: express.Response) => {
        const admin = await this.userService.getAdminUser();
        const canSetupAdmin = admin ? false : true;
        res.status(httpStatus.OK).json(canSetupAdmin);
    }

    /**
     * Setup for first time using
     */
    public setupAdminSite = async (req: express.Request, res: express.Response) => {
        // step 1: check if there is not any admin account
        let admin = await this.userService.getAdminUser();
        if (admin) { res.status(httpStatus.OK).json('The Admin account has already created'); }

        // step 2: create admin account
        admin = await this.userService.createAdminUser(req.body);

        // step 3: check if there is not any language
        const languages = await this.languageService.getEnabledLanguages();
        if (languages.length === 0) {
            // step 4: create default language
            const defaultLanguageDoc: Partial<ILanguageBranchDocument> = {
                language: 'en',
                name: 'English',
                sortIndex: 1,
                enabled: true
            }
            await this.languageService.addLanguage(defaultLanguageDoc, admin._id.toString());
        }

        res.status(httpStatus.OK).json(admin);
    }

    public register = async (req: express.Request, res: express.Response) => {
        const user = await this.userService.createUser(req.body);
        const tokens = await this.tokenService.generateAuthTokens(user);
        this.setRefreshTokenCookie(res, tokens.refresh);
        res.status(httpStatus.CREATED).send({ ...tokens.access });
    };

    public login = async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;
        const user = await this.authService.loginUserWithUsernameAndPassword(username, password);
        const tokens = await this.tokenService.generateAuthTokens(user);
        this.setRefreshTokenCookie(res, tokens.refresh);
        res.status(httpStatus.OK).json({ ...tokens.access });
    };

    public revokeToken = async (req: express.Request, res: express.Response) => {
        const refreshToken = req.cookies[this.refreshTokenCookie];
        if (refreshToken) {
            await this.authService.revokeRefreshToken(refreshToken);
            res.cookie(this.refreshTokenCookie, '', { maxAge: 0 });
            res.status(httpStatus.OK).json('Revoke successfully');
        } else {
            res.status(httpStatus.OK).json('Refresh token was not found');
        }
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