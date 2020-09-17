import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { languages } from '../../config/languages';
import { Language } from './language.model';

@Injectable()
export class LanguageController {
    getAll = async (req: express.Request, res: express.Response) => {
        const languageCodes: Language[] = languages;
        res.status(httpStatus.OK).json(languageCodes)
    }
}