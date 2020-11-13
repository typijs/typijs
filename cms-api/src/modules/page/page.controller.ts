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

  constructor(private pageService: PageService) {
    super(pageService);
  }

  get = async (req: express.Request, res: express.Response) => {
    const { language } = req as any;
    const content = await this.pageService.getPrimaryVersionOfPageById(req.params.id, language, req.query.versionId, req.query.host)
    res.status(httpStatus.OK).json(content)
  }

  //Override insert base
  create = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;
    const savedContent = await this.pageService.executeCreatePageFlow(req.body, user.id, language)
    res.status(httpStatus.OK).json(savedContent)
  }

  publish = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;

    const validUrlSegment = await this.pageService.validateUrlSegment(req.params.id, language);
    if (validUrlSegment) {
      const publishedContent = await this.pageService.executePublishContentFlow(req.params.id, req.query.versionId, user.id, language)
      res.status(httpStatus.OK).json(publishedContent)
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('The url must be unique, consider change url segment please');
    }
  }

  getByUrl = async (req: express.Request, res: express.Response) => {
    const item = await this.pageService.getPublishedPageByUrl(req.params.url);
    res.status(httpStatus.OK).json(item);
  }

  getPublishedPageChildren = async (req: express.Request, res: express.Response) => {
    const { language } = req as any;
    const items = await this.pageService.getPublishedPageChildren(req.params.parentId, language, req.query.host);
    res.status(httpStatus.OK).json(items);
  }

  getPageChildren = async (req: express.Request, res: express.Response,) => {
    const { language } = req as any;
    const items = await this.pageService.getContentChildren(req.params.parentId, language);
    res.status(httpStatus.OK).json(items);
  }
}
