import * as Joi from '@hapi/joi';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { Profiler } from '../../logging';
import { ValidateParams } from '../../validation/validate.decorator';
import { ContentController } from '../content/content.controller';
import { IPageLanguageDocument } from './models/page-language.model';
import { IPageVersionDocument } from './models/page-version.model';
import { IPageDocument } from './models/page.model';
import { PageService, PageVersionService } from './page.service';

@Injectable()
export class PageController extends ContentController<IPageDocument, IPageLanguageDocument, IPageVersionDocument> {

  constructor(private pageService: PageService, pageVersionService: PageVersionService) {
    super(pageService, pageVersionService);
  }

  /*------------------------PAGE-----------------------*/
  @Profiler({
    outputConsole: true,
    thresholdInMs: 200,
    parametersAsString: (args) => args[0].params.url
  })
  @ValidateParams({ url: Joi.string().required() })
  async getByUrl(req: express.Request, res: express.Response) {
    const item = await this.pageService.getPublishedPageByUrl(req.params.url);
    res.status(httpStatus.OK).json(item);
  }

  async getPageUrls(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const items = await this.pageService.getPageUrls(req.body, language, req.query.host);
    res.status(httpStatus.OK).json(items);
  }
}
