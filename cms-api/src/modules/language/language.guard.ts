import { Injectable } from "injection-js";
import { NextFunction, Request, Response } from "express";
import { Validator } from "../../validation";
import { LanguageService } from "./language.service";

@Injectable()
export class LanguageGuard {

    constructor(private languageService: LanguageService) { }

    /**
     * The middleware to check if the language is enabled
     */
    public checkEnabled = () => async (req: Request, res: Response, next: NextFunction) => {
        try {
            let language = req.query.language;
            if (language) {
                const exitedLang = await this.languageService.getLanguageByCode(language);
                Validator.throwIfNotFound('exitedLang', exitedLang);
                language = exitedLang.language;
            }
            else {
                const listEnabledLangs = (await this.languageService.getEnabledLanguages())
                if (!listEnabledLangs || listEnabledLangs.length == 0) throw new DocumentNotFoundException(language, 'There is not any enable language');
                language = listEnabledLangs[0].language;
            }
            req['language'] = language;
        } catch (err) {
            next(err);
        }
        next()
    }
}