import * as Joi from '@hapi/joi';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { Roles } from '../../constants';
import { ValidateParams } from '../../validation';
import { Authorize } from '../auth';
import { BaseController } from '../shared/base.controller';
import { ISiteDefinitionDocument } from './site-definition.model';
import { SiteDefinitionService } from './site-definition.service';

@Injectable()
export class SiteDefinitionController extends BaseController<ISiteDefinitionDocument> {
    constructor(private siteDefinitionService: SiteDefinitionService) {
        super(siteDefinitionService)
    }

    get = async (req: express.Request, res: express.Response) => {
        const item = await this.siteDefinitionService
            .findById(req.params.id)
            .populate('startPage')
            .exec()
        res.status(httpStatus.OK).json(item)
    }

    getAll = async (req: express.Request, res: express.Response) => {
        const items = await this.siteDefinitionService
            .getAll({ lean: true })
            .populate('startPage')
            .exec();
        res.status(httpStatus.OK).json(items)
    }

    @ValidateParams({
        host: Joi.string().required()
    })
    async getSiteIdByHost(req: express.Request, res: express.Response) {
        const host = req.params.host;
        const item = await this.siteDefinitionService.getCurrentSiteDefinition(host);
        res.status(httpStatus.OK).json(item)
    }

    @Authorize({ roles: [Roles.Admin] })
    async createSiteDefinition(req: express.Request, res: express.Response) {
        const { id } = req['user'];
        const item = await this.siteDefinitionService.createSiteDefinition(req.body, id);
        res.status(httpStatus.OK).json(item)
    }
}