import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { languages } from './languages';
import { BaseController } from '../shared/base.controller';
import { ILanguageBranchDocument, Language } from './language.model';
import { LanguageService } from './language.service';
import { Authorize } from '../auth/auth.decorator';
import { Roles } from '../../constants';
import { ValidateBody } from '../../validation/validate.decorator';
import * as Joi from '@hapi/joi';

@Injectable()
export class LanguageController extends BaseController<ILanguageBranchDocument> {
    constructor(private languageService: LanguageService) { super(languageService) }

    async getEnabledLanguages(req: express.Request, res: express.Response) {
        const languageBranches: ILanguageBranchDocument[] = await this.languageService.getEnabledLanguages();
        res.status(httpStatus.OK).json(languageBranches)
    }

    @Authorize({ roles: [Roles.Admin] })
    async getAllLanguageCodes(req: express.Request, res: express.Response) {
        const registeredLanguages = await this.languageService.getAll({ lean: true }).select('name').exec();
        const languageCodes: Language[] = languages;
        languageCodes.forEach(lang => lang.registered = registeredLanguages.findIndex(x => x.name == lang.name) != -1)
        res.status(httpStatus.OK).json(languageCodes)
    }

    @Authorize({ roles: [Roles.Admin] })
    @ValidateBody({
        language: Joi.string().required(),
        name: Joi.string().required()
    })
    async addLanguage(req: express.Request, res: express.Response) {
        const item = await this.languageService.addLanguage(req.body, req['user'].id);
        res.status(httpStatus.OK).json(item)
    }

    @Authorize({ roles: [Roles.Admin] })
    async updateLanguage(req: express.Request, res: express.Response) {
        const item = await this.languageService.updateLanguage(req.params.id, req.body, req['user'].id)
        res.status(httpStatus.OK).json(item)
    }
}