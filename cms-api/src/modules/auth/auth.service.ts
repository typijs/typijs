import { Injectable } from "injection-js";

import { UnauthorizedException } from "../../errorHandling";
import { IUserDocument } from "../user/user.model";
import { UserService } from "../user/user.service";
import { AuthTokens } from "./token.model";
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
        if (!user || !(await user.comparePassword(password))) {
            throw new UnauthorizedException('Incorrect email or password');
        }
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
}

