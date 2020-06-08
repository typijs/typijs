import * as mongoose from 'mongoose';
import { IBaseDocument, IBaseModel } from '../shared/base.model';
import { cmsUser } from '../user/user.model';

export type TokenType = 'refresh' | 'resetPassword';
export type TokenPayload = {
    sub: string,
    iat: number,
    exp: number,
}
export type TokenDto = {
    token: string
    expiry: Date
}

export type AuthTokens = {
    access: TokenDto
    refresh: TokenDto
}

export interface IToken {
    token: string;
    user: string;
    type: TokenType;
    expiry: Date;
    blacklisted: boolean;
}

export interface ITokenDocument extends IToken, IBaseDocument { }
export interface ITokenModel extends IBaseModel<ITokenDocument> { }

const TokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, index: true },
        user: { type: mongoose.SchemaTypes.ObjectId, ref: cmsUser, required: true },
        type: { type: String, enum: ['refresh', 'resetPassword'], required: true },
        expiry: { type: Date, required: true },
        blacklisted: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
    }
);

export const cmsToken = 'cms_Token';
export const TokenModel: ITokenModel = mongoose.model<ITokenDocument, ITokenModel>(cmsToken, TokenSchema);