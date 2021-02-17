import 'reflect-metadata';
import * as express from 'express';
import * as  httpStatus from 'http-status';

import { Injectable } from 'injection-js';

import { pick } from '../../utils';
import { BaseController, PaginateOptions } from '../shared';
import { IUserDocument } from './user.model';
import { UserService } from './user.service';

@Injectable()
export class UserController extends BaseController<IUserDocument> {

    constructor(private userService: UserService) {
        super(userService);
    }

    createUser = async (req: express.Request, res: express.Response) => {
        const { id } = req['user'];
        const newDoc: Partial<IUserDocument> = Object.assign({ createdBy: id }, req.body);
        const item = await this.userService.createUser(newDoc)
        res.status(httpStatus.OK).json(item)
    }

    getUsers = async (req: express.Request, res: express.Response) => {
        const filter = pick(req.query, ['name', 'role']);
        const options = pick(req.query, ['sortBy', 'limit', 'page']) as PaginateOptions;
        const result = await this.userService.paginate(filter, options);
        res.status(httpStatus.OK).json(result);
    };

    createAdminUser = async (req: express.Request, res: express.Response) => {
        const admin = await this.userService.createAdminUser(req.body);
        res.status(httpStatus.OK).json(admin);
    };

    updateUser = async (req: express.Request, res: express.Response) => {
        const { id } = req['user'];
        const doc: Partial<IUserDocument> = Object.assign({ updatedBy: id }, req.body);
        const item = await this.userService.updateUserById(req.params.id, doc)
        res.status(httpStatus.OK).json(item)
    }

}