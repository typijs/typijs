import 'reflect-metadata';
import * as express from 'express';
import * as  httpStatus from 'http-status';

import { Injectable } from 'injection-js';

import { pick } from '../../utils/pick';
import { BaseController } from '../shared/base.controller';
import { IUserDocument } from './user.model';
import { UserService } from './user.service';

@Injectable()
export class UserController extends BaseController<IUserDocument> {

    constructor(private userService: UserService) {
        super(userService);
    }

    public getUsers = async (req: express.Request, res: express.Response) => {
        const filter = pick(req.query, ['name', 'role']);
        const options = pick(req.query, ['sortBy', 'limit', 'page']);
        const result = await this.userService.paginate(filter, options);
        res.status(httpStatus.OK).json(result);
    };

    public createAdminUser = async (req: express.Request, res: express.Response) => {
        const admin = await this.userService.createAdminUser(req.body);
        res.status(httpStatus.OK).json(admin);
    };

}