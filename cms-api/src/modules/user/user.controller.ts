import * as express from 'express';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { UserModel, IUserDocument } from './user.model';
import { BaseController } from '../shared/base.controller';
import { UserService } from './user.service';
import { pick } from '../../utils/pick';

@Injectable()
export class UserController extends BaseController<IUserDocument> {

    constructor(private userService: UserService) {
        super(userService);
    }

    public getUsers = async (req: express.Request, res: express.Response) => {
        const filter = pick(req.query, ['name', 'role']);
        const options = pick(req.query, ['sortBy', 'limit', 'page']);
        const result = await this.userService.queryDocuments(filter, options);
        res.send(result);
    };




}