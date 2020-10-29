import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { languages } from '../../config/languages';
import { BaseController } from '../shared/base.controller';
import { ILanguageBranchDocument, Language } from './language.model';

@Injectable()
export class LanguageController extends BaseController<ILanguageBranchDocument> {

    getAvailableLanguages = async (req: express.Request, res: express.Response) => {
        const languageBranches: ILanguageBranchDocument[] = await this.baseService.find({ enabled: true }, { lean: true }).exec();
        res.status(httpStatus.OK).json(languageBranches)
    }

    getAllLanguageCodes = async (req: express.Request, res: express.Response) => {
        const languageCodes: Language[] = languages;
        res.status(httpStatus.OK).json(languageCodes)
    }
}