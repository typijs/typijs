import { NextFunction, Request, Response } from "express";
import { Injectable } from "injection-js";
import * as jwt from 'jsonwebtoken';

import { config } from '../../config/config';
import { ForbiddenException, UnauthorizedException } from "../../error";
import { TokenPayload } from './token.model';

// TODO should use DI in here
@Injectable()
export class AuthGuard {

    /**
     * The middleware to check authenticated of auth guard
     */
    public checkAuthenticated = () => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isAuthenticated = this.verifyAuthenticated(req);
            if (!isAuthenticated) throw new UnauthorizedException('Unauthorized!')
        } catch (err) {
            next(err);
        }
        next()
    }

    /**
     * The middleware to check if logged in user has roles
     * 
     * Check has roles: `admin` AND `editor`
     * ```
     * authGuard.checkRoles(['admin', 'editor'])
     * ```
     * Check has roles: `admin` OR (`editor` AND `visitor`)
     * ```
     * authGuard.checkRoles([['admin'], ['editor', 'visitor']])
     * ```
     * 
     * @param requiredRoles Array of roles
     */
    public checkRoles = (requiredRoles?: string[][] | string[]) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isAuthenticated = this.verifyAuthenticated(req);
            if (!isAuthenticated) throw new UnauthorizedException('Unauthorized!')

            const { roles } = req['user'];
            const checkResult = this.checkHasRoles(roles, requiredRoles);
            if (!checkResult) throw new ForbiddenException('Forbidden');
        } catch (err) {
            next(err);
        }
        next()
    }

    /**
     * Check permissions of auth guard (Not used anywhere)
     */
    public checkPermissions = (requiredPermissions?: string[][] | string[]) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isAuthenticated = this.verifyAuthenticated(req);
            if (!isAuthenticated) throw new UnauthorizedException('Unauthorized!')

            //TODO: check has permission here
        } catch (err) {
            next(err);
        }
        next()
    }

    private verifyAuthenticated = (req: Request): boolean => {
        const token = this.getToken(req);
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

    private checkHasRoles = (userRoles: string[], requiredRoles?: string[][] | string[]): boolean => {
        if (requiredRoles && requiredRoles.length > 0) {
            const normalizeRequiredRoles = (checkRoles?: any[]): string[][] => {
                if (checkRoles.every(role => typeof role === 'string')) {
                    return [checkRoles];
                } else {
                    return checkRoles;
                }
            }

            const checkRoles = normalizeRequiredRoles(requiredRoles);
            const hasRequiredRoles = checkRoles.some(inRoles => {
                return inRoles.every(role => userRoles.includes(role))

            })

            return hasRequiredRoles;
        }
    }

    private getToken = (req: Request): string => {
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

export const authGuard = new AuthGuard();