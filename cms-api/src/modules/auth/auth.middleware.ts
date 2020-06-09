import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

import { config } from '../../config/config';
import { UnauthorizedException } from '../../errorHandling/exceptions/UnauthorizedException';
import { TokenPayload } from './token.model';

const getToken = (req: Request): string => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

const verifyToken = (token: string, secret: string): Promise<any> => {
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

export const auth = (requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);
    if (!token) {
        next(new UnauthorizedException('No token provided'));
    }

    const tokenPayload = jwt.verify(token, config.jwt.secret) as TokenPayload
    if (!tokenPayload) {
        next(new UnauthorizedException('Invalid token'));
    }

    req['user'] = tokenPayload
    next();
};