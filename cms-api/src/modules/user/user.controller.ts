import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import * as httpStatus from 'http-status';

import { User, IUserModel } from './user.model';
import { BaseController } from '../shared/base.controller';

export default class UserCtrl extends BaseController<mongoose.Model<IUserModel>> {
    constructor() { super(User); }

    login = (req, res) => {
        this.model.findOne({ email: req.body.email }, (err, user) => {
            if (!user) { return res.sendStatus(403); }
            user.comparePassword(req.body.password, (error, isMatch) => {
                if (!isMatch) { return res.sendStatus(403); }
                const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
                res.status(httpStatus.OK).json({ token: token });
            });
        });
    }

    setup = () => {
        var admin = new this.model({
            username: "admin",
            email: "admin@angularcms.com",
            password: "admin",
            role: ["admin"]
        })

        this.model.findOne({ username: admin.username }, (err, user) => {
            if (!user) {
                admin.save((err, item) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('User saved successfully');
                })
            }
        })
    }
}