import * as Joi from '@hapi/joi';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { AdminOrEditor } from '../../constants';
import { Profiler } from '../../logging';
import { ValidateBody, ValidateParams, ValidateQuery } from '../../validation/validate.decorator';
import { Authorize } from '../auth/auth.decorator';
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

  @Authorize({ roles: AdminOrEditor })
  @ValidateBody({
    name: Joi.string().required(),
    contentType: Joi.string().required()
  })
  async createContent(req: express.Request, res: express.Response) {
    const { user, language } = req as any;
    const savedContent = await this.pageService.executeCreatePageFlow(req.body, language, user.id)
    res.status(httpStatus.OK).json(savedContent)
  }

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

  @Profiler({
    outputConsole: true,
    thresholdInMs: 300,
    parametersAsString: (args) => `${args[0].params.parentId}, ${args[0]['language']}, ${args[0].query.host}`
  })
  async getPublishedPageChildren(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const items = await this.pageService.getPublishedPageChildren(req.params.parentId, language, req.query.host);
    res.status(httpStatus.OK).json(items);
  }

  async getPageChildren(req: express.Request, res: express.Response,) {
    const { language } = req as any;
    const items = await this.pageService.getContentChildren(req.params.parentId, language);
    res.status(httpStatus.OK).json(items);
  }

  /*------------------------VERSION-----------------------*/
  @Authorize({ roles: AdminOrEditor })
  async getVersion(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const content = await this.pageService.getPageVersion(req.params.id, req.query.versionId, language, req.query.host)
    res.status(httpStatus.OK).json(content)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateQuery({ versionId: Joi.string().required() })
  async publishVersion(req: express.Request, res: express.Response) {
    const { user } = req as any;
    const publishedContent = await this.pageService.executePublishPageFlow(req.params.id, req.query.versionId, user.id)
    res.status(httpStatus.OK).json(publishedContent)
  }
}
