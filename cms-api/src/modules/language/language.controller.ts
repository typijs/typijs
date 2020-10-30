import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { languages } from './languages';
import { BaseController } from '../shared/base.controller';
import { ILanguageBranchDocument, Language } from './language.model';
import { LanguageService } from '.';

@Injectable()
export class LanguageController extends BaseController<ILanguageBranchDocument> {
    constructor(private languageService: LanguageService) { super(languageService) }

    getAvailableLanguages = async (req: express.Request, res: express.Response) => {
        const languageBranches: ILanguageBranchDocument[] = await this.languageService.find({ enabled: true }, { lean: true }).exec();
        res.status(httpStatus.OK).json(languageBranches)
    }

    getAllLanguageCodes = async (req: express.Request, res: express.Response) => {
        const registeredLanguages = await this.languageService.getAll({ lean: true }).select('name').exec();
        const languageCodes: Language[] = languages;
        languageCodes.forEach(lang => lang.registered = registeredLanguages.findIndex(x => x.name == lang.name) != -1)
        res.status(httpStatus.OK).json(languageCodes)
    }
}