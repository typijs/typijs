import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { config } from '../../config/config';
import { BaseService } from '../shared/base.service';
import { UserService } from '../user/user.service';
import { ITokenDocument, TokenType, AuthTokens, TokenPayload, TokenModel } from './token.model';
import { DocumentNotFoundException } from '../../errorHandling';
import { Injectable } from 'injection-js';

@Injectable()
export class TokenService extends BaseService<ITokenDocument>{
    constructor(private userService: UserService) {
        super(TokenModel);
    }

    /**
     * Generate token
     * @param {ObjectId} userId
     * @param {Moment} expiry
     * @param {string} [secret]
     * @returns {string}
     */
    private generateToken = (userId: string, expiry: moment.Moment, secret: jwt.Secret = config.jwt.secret): string => {
        const payload: TokenPayload = {
            sub: userId,
            iat: moment().unix(),
            exp: expiry.unix(),
        };
        return jwt.sign(payload, secret);
    };

    /**
     * Save a token
     * @param {string} token
     * @param {ObjectId} userId
     * @param {Moment} expiry
     * @param {string} type
     * @param {boolean} [blacklisted]
     * @returns {Promise<Token>}
     */
    private saveToken = (token: string, userId: string, expiry: moment.Moment, type: TokenType, blacklisted: boolean = false): Promise<ITokenDocument> => {
        const tokenDoc: ITokenDocument = this.createModel({
            token,
            user: userId,
            expiry: expiry.toDate(),
            type,
            blacklisted,
        });
        return tokenDoc.save();
    };

    /**
     * Verify token and return token doc (or throw an error if it is not valid)
     * @param {string} token
     * @param {string} type
     * @returns {Promise<Token>}
     */
    public verifyToken = async (token: string, type: TokenType): Promise<ITokenDocument> => {
        const payload: TokenPayload = jwt.verify(token, config.jwt.secret) as TokenPayload;
        const tokenDoc = await this.findOne({ token, type, user: payload.sub, blacklisted: false });
        if (!tokenDoc) {
            throw new DocumentNotFoundException(token, `Token ${token} is not found`);
        }
        return tokenDoc;
    };

    /**
     * Generate auth tokens
     * @param {User} user
     * @returns {Promise<Object>}
     */
    public generateAuthTokens = async (user): Promise<AuthTokens> => {
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        const accessToken = this.generateToken(user.id, accessTokenExpires);

        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
        const refreshToken = this.generateToken(user.id, refreshTokenExpires);
        await this.saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');

        return {
            access: {
                token: accessToken,
                expiry: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expiry: refreshTokenExpires.toDate(),
            },
        };
    };

    /**
     * Generate reset password token
     * @param {string} email
     * @returns {Promise<string>}
     */
    public generateResetPasswordToken = async (email): Promise<string> => {
        const user = await this.userService.getUserByUsername(email);
        if (!user) {
            throw new DocumentNotFoundException(email, `No users found with this email ${email}`);
        }
        const expiry = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
        const resetPasswordToken = this.generateToken(user.id, expiry);
        await this.saveToken(resetPasswordToken, user.id, expiry, 'resetPassword');
        return resetPasswordToken;
    };

}