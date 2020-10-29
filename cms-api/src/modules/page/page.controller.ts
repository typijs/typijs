import 'reflect-metadata';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { ContentController } from '../content/content.controller';
import { PageService } from './page.service';

import { IPageDocument } from './models/page.model';
import { IPageVersionDocument } from './models/page-version.model';
import { IPageLanguageDocument } from './models/page-language.model';

@Injectable()
export class PageController extends ContentController<IPageDocument, IPageLanguageDocument, IPageVersionDocument> {

  private pageService: PageService;
  constructor(pageService: PageService) {
    super(pageService);
    this.pageService = pageService;
  }

  //Override insert base
  create = async (req: express.Request, res: express.Response) => {
    const user = req['user'];
    const item = await this.pageService.executeCreatePageFlow(req.body, user.id, req.query.language)
    res.status(httpStatus.OK).json(item)
  }

  publish = async (req: express.Request, res: express.Response) => {
    const user = req['user'];
    const validUrlSegment = await this.pageService.validateUrlSegment(req.params.id, req.query.language);
    const publishedContent = await this.pageService.executePublishContentFlow(req.params.id, user.id, req.query.language)
    res.status(httpStatus.OK).json(publishedContent)
  }

  getByUrl = async (req: express.Request, res: express.Response) => {
    const item = await this.pageService.getPublishedPageByUrl(req.params.url);
    res.status(httpStatus.OK).json(item);
  }

  getPublishedPageChildren = async (req: express.Request, res: express.Response) => {
    const items = await this.pageService.getPublishedPageChildren(req.params.parentId, req.query.language);
    res.status(httpStatus.OK).json(items);
  }

  getPageChildren = async (req: express.Request, res: express.Response,) => {
    const items = await this.pageService.getContentChildren(req.params.parentId, req.query.language);
    res.status(httpStatus.OK).json(items);
  }
}
