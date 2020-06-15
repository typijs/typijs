import { Injectable } from 'injection-js';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { config } from '../../config/config';
import { DocumentNotFoundException } from '../../errorHandling';
import { BaseService } from '../shared/base.service';
import { IUserDocument } from '../user/user.model';
import { UserService } from '../user/user.service';
import { AuthTokens, ITokenDocument, TokenModel, TokenPayload, TokenType } from './token.model';

@Injectable()
export class TokenService extends BaseService<ITokenDocument>{
    constructor(private userService: UserService) {
        super(TokenModel);
    }
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
     * @param {IUserDocument} user
     * @returns {Promise<Object>}
     */
    public generateAuthTokens = async (user: IUserDocument): Promise<AuthTokens> => {
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        const accessToken = this.generateToken(user, accessTokenExpires);

        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
        const refreshToken = this.generateToken(user, refreshTokenExpires);
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
    public generateResetPasswordToken = async (email: string): Promise<string> => {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new DocumentNotFoundException(email, `No users found with this email ${email}`);
        }
        const expiry = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
        const resetPasswordToken = this.generateToken(user, expiry);
        await this.saveToken(resetPasswordToken, user.id, expiry, 'resetPassword');
        return resetPasswordToken;
    };

    /**
     * Generate token
     * @param {IUserDocument} user
     * @param {Moment} expiry
     * @param {string} [secret]
     * @returns {string}
     */
    private generateToken = (user: IUserDocument, expiry: moment.Moment, secret: jwt.Secret = config.jwt.secret): string => {
        const payload: TokenPayload = {
            roles: user.roles,
            userId: user.id,
            sub: user.id,
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
}