import 'reflect-metadata';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { ContentController } from '../content/content.controller';
import { PageService, PageVersionService } from './page.service';

import { IPageDocument } from './models/page.model';
import { IPageVersionDocument } from './models/page-version.model';
import { IPageLanguageDocument } from './models/page-language.model';

@Injectable()
export class PageController extends ContentController<IPageDocument, IPageLanguageDocument, IPageVersionDocument> {

  constructor(private pageService: PageService, pageVersionService: PageVersionService) {
    super(pageService, pageVersionService);
  }

  /*------------------------PAGE-----------------------*/

  create = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;
    const savedContent = await this.pageService.executeCreatePageFlow(req.body, language, user.id)
    res.status(httpStatus.OK).json(savedContent)
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

  /*------------------------VERSION-----------------------*/
  getVersion = async (req: express.Request, res: express.Response) => {
    const { language } = req as any;
    const content = await this.pageService.getPageVersion(req.params.id, req.query.versionId, language, req.query.host)
    res.status(httpStatus.OK).json(content)
  }

  publishVersion = async (req: express.Request, res: express.Response) => {
    const { user } = req as any;
    const publishedContent = await this.pageService.executePublishPageFlow(req.params.id, req.query.versionId, user.id)
    res.status(httpStatus.OK).json(publishedContent)
  }

}
