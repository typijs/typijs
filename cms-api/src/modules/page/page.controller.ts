import 'reflect-metadata';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';

import { ContentController } from '../content/content.controller';
import { PageService } from './page.service';

import { IPageDocument } from './models/page.model';
import { IPageVersionDocument } from './models/page-version.model';
import { IPublishedPageDocument } from './models/published-page.model';

@Injectable()
export class PageController extends ContentController<IPageDocument, IPageVersionDocument, IPublishedPageDocument> {

  private pageService: PageService;
  constructor(pageService: PageService) {
    super(pageService);
    this.pageService = pageService;
  }

  getByUrl = async (req: express.Request, res: express.Response) => {
    const item = await this.pageService.getPublishedPageByUrl(req.params.url);
    res.status(httpStatus.OK).json(item);
  }

  getPublishedPageChildren = async (req: express.Request, res: express.Response) => {
    const items = await this.pageService.getPublishedPageChildren(req.params.parentId)
    res.status(httpStatus.OK).json(items);
  }

  getPageChildren = async (req: express.Request, res: express.Response, ) => {
    const items = await this.pageService.getPageChildren(req.params.parentId)
    res.status(httpStatus.OK).json(items);
  }

  //Override insert base
  insert = async (req: express.Request, res: express.Response) => {
    const item = await this.pageService.executeCreatePageFlow(req.body)
    res.status(httpStatus.OK).json(item)
  }

  update = async (req: express.Request, res: express.Response) => {
    const pageDocument = this.pageService.createModel(req.body);
    const savedPage = await this.pageService.updateAndPublishContent(req.params.id, pageDocument)
    res.status(httpStatus.OK).json(savedPage)
  }
}
