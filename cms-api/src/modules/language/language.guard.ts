import { Injectable } from "injection-js";
import { NextFunction, Request, Response } from "express";
import { LanguageService } from "./language.service";
import { DocumentNotFoundException } from "../../error";

@Injectable()
export class LanguageGuard {

    constructor(private languageService: LanguageService) { }

    /**
     * The middleware to check authenticated of auth guard
     */
    public checkEnabled = () => async (req: Request, res: Response, next: NextFunction) => {
        try {
            let language = req.query.language;
            if (language) {
                const exitedLang = await this.languageService.getLanguageByCode(language);
                if (!exitedLang) throw new DocumentNotFoundException(language, 'The language is not found');
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