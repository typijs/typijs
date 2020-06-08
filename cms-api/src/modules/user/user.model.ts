import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import { IBaseDocument, IBaseModel, BaseSchema } from '../shared/base.model';
import { paginate } from '../../db/plugins/paginate';

export interface IUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: any[];
}

export interface IUserDocument extends IUser, IBaseDocument {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends IBaseModel<IUserDocument> { }

const UserSchema = new mongoose.Schema({
    ...BaseSchema.obj,
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, trim: true, private: true },
    role: Array,
}, { timestamps: true });

// Omit the password when returning a user
UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.password;
        return ret;
    }
});

// Before saving the user, hash the password
UserSchema.pre<IUserDocument>('save', async function (next) {
    const saltRounds = 10;
    const user: IUserDocument = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();
});

/**
 * Check if password matches the user's password
 * @param {string} candidatePassword in plain text
 * @returns {Promise<boolean>}
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user: IUserDocument = this as IUserDocument;
    return bcrypt.compare(candidatePassword, user.password)
};

UserSchema.plugin(paginate)

export const cmsUser = 'cms_User';
export const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>(cmsUser, UserSchema);


