import * as httpStatus from 'http-status';
import { Roles } from '../../constants/roles';
import { EmailDuplicateException, Exception } from '../../error/exceptions';
import { BaseService } from "../shared/base.service";
import { IUserDocument, UserModel } from "./user.model";

export class UserService extends BaseService<IUserDocument>{

    constructor() {
        super(UserModel);
    }

    public createAdminUser = async (userDoc: Partial<IUserDocument>): Promise<IUserDocument> => {
        userDoc.roles = [Roles.Admin, Roles.Editor];
        const admin = await this.createUser(userDoc);
        if (admin) {
            //TODO: Create default roles (admin, editor)
        }
        return admin;
    }

    public getAdminUser = async (): Promise<IUserDocument> => {
        return await this.findOne({ roles: Roles.Admin }).exec()
    }

    /**
     * Create a user
     * @param {IUserDocument} user
     * @returns {Promise<IUserDocument>}
     */
    public createUser = async (user: Partial<IUserDocument>): Promise<IUserDocument> => {
        if (await this.isEmailTaken(user.email)) {
            throw new EmailDuplicateException(user.email);
        }

        if (await this.isUsernameTaken(user.username)) {
            throw new Exception(httpStatus.BAD_REQUEST, `Username ${user.username} already taken`);
        }

        return this.create(user);
    };

    public updateUserById = async (userId: string, userDoc: Partial<IUserDocument>): Promise<IUserDocument> => {
        if (userDoc.email && (await this.isEmailTaken(userDoc.email, userId))) {
            throw new EmailDuplicateException(userDoc.email);
        }
        delete userDoc.username;
        delete userDoc.password;
        delete userDoc.roles;
        return await this.updateById(userId, userDoc);
    }

    public getUserByUsername = (username: string): Promise<IUserDocument> => {
        return this.findOne({ username }).exec();
    };

    public getUserByEmail = (email: string): Promise<IUserDocument> => {
        return this.findOne({ email }, { lean: true }).exec();
    };

    private isEmailTaken = async (email: string, excludeUserId?: string): Promise<boolean> => {
        const user = await this.findOne({ email, _id: { $ne: excludeUserId } }, { lean: true }).exec();
        return !!user;
    };

    private isUsernameTaken = async (username: string): Promise<boolean> => {
        const user = await this.findOne({ username }, { lean: true }).exec();
        return !!user;
    };
}