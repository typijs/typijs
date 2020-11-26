import { Request } from "express";
import { Injectable } from "injection-js";
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { UnauthorizedException } from "../../error";
import { IUserDocument } from "../user/user.model";
import { UserService } from "../user/user.service";
import { AuthTokens, TokenPayload } from "./token.model";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private tokenService: TokenService) { }
    /**
     * Login with username and password
     * @param {string} username
     * @param {string} password
     * @returns {Promise<IUserDocument>}
     */
    public loginUserWithUsernameAndPassword = async (username: string, password: string): Promise<IUserDocument> => {
        const user = await this.userService.getUserByUsername(username);
        if (!user) throw new UnauthorizedException('Incorrect username');
        if (!(await user.comparePassword(password))) throw new UnauthorizedException('Incorrect password');

        return user;
    };

    /**
     * Refresh auth tokens
     * @param {string} refreshToken
     * @returns {Promise<AuthTokens>}
     */
    public refreshAuth = async (refreshToken: string): Promise<AuthTokens> => {
        const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, 'refresh');
        const user = await this.userService.findById(refreshTokenDoc.user);
        if (!user) {
            throw new UnauthorizedException('Please authenticate');
        }
        await refreshTokenDoc.remove();
        return this.tokenService.generateAuthTokens(user);
    };

    public revokeRefreshToken = async (refreshToken: string): Promise<void> => {
        const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, 'refresh');
        await refreshTokenDoc.remove();
    };

    /**
     * Reset password
     * @param {string} resetPasswordToken
     * @param {string} newPassword
     * @returns {Promise}
     */
    public resetPassword = async (resetPasswordToken: string, newPassword: string) => {
        const resetPasswordTokenDoc = await this.tokenService.verifyToken(resetPasswordToken, 'resetPassword');
        const user = await this.userService.findById(resetPasswordTokenDoc.user);
        if (!user) {
            throw new UnauthorizedException('Password reset failed');
        }
        await this.tokenService.deleteMany({ user: user.id, type: 'resetPassword' });
        await this.userService.updateById(user.id, { password: newPassword });
    };

    /**
     * Check if the request is authenticated
     * @returns true if the request is authenticated, otherwise throw unauthorized exception
     */
    public isAuthenticated = (req: Request): boolean => {
        const token = this.extractTokenFromRequest(req);
        if (!token) {
            throw new UnauthorizedException('No token was provided')
        }

        try {
            const tokenPayload = jwt.verify(token, config.jwt.secret) as TokenPayload;
            const { sub, username, roles } = tokenPayload;
            req['user'] = { id: sub, username, roles };
            return true;
        } catch (err) {
            throw new UnauthorizedException(err.message)
        }
    }

    /**
     * Check if user's roles have the required role
     * @param userRoles The exited roles of user
     * @param requiredRoles The input role to verify
     * @returns true if user has required role, otherwise throw exception
     */
    public isInRoles = (userRoles: string[], requiredRoles?: string[][] | string[]): boolean => {
        if (requiredRoles && requiredRoles.length > 0) {
            const normalizeRequiredRoles = (checkRoles?: any[]): string[][] => {
                if (checkRoles.every(role => typeof role === 'string')) {
                    return [checkRoles];
                } else {
                    return checkRoles;
                }
            }

            const checkRoles = normalizeRequiredRoles(requiredRoles);
            const hasRequiredRoles = checkRoles.every(inRoles => {
                return inRoles.some(role => userRoles.includes(role))

            })

            return hasRequiredRoles;
        }
    }

    private extractTokenFromRequest = (req: Request): string => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }

    private verifyTokenAsync = (token: string, secret: string): Promise<any> => {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, secret, function (err, decode) {
                if (err) {
                    reject(err)
                    return
                }

                resolve(decode)
            })
        })
    }
}

