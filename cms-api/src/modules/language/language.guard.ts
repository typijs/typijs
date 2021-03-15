import { NextFunction, Request, Response } from "express";
import { Injectable } from "injection-js";
import 'reflect-metadata';
import { isNil } from "../../utils";
import { Validator } from "../../validation";
import { SiteDefinitionService } from "../site-definition/site-definition.service";
import { LanguageService } from "./language.service";

@Injectable()
export class LanguageGuard {
    constructor(private languageService: LanguageService, private siteDefinitionService: SiteDefinitionService) { }
    /**
     * The middleware to check if the language is enabled
     */
    public checkEnabled = () => async (req: Request, res: Response, next: NextFunction) => {
        try {
            let language = req.query.language;
            if (language !== this.languageService.EMPTY_LANGUAGE) {
                if (!isNil(language)) {
                    const exitedLang = await this.languageService.getLanguageByCode(language);
                    Validator.throwIfNotFound('exitedLang', exitedLang);
                    language = exitedLang.language;
                }
                else {
                    const [startPageId, defaultLanguage] = await this.siteDefinitionService.getCurrentSiteDefinition(req.query.host)
                    Validator.throwIfNullOrEmpty('defaultLanguage', defaultLanguage);
                    language = defaultLanguage;
                }
            }

            req['language'] = language;
        } catch (err) {
            next(err);
        }
        next()
    }
}