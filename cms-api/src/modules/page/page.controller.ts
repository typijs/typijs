import * as express from 'express';

import { ContentController } from '../content/content.controller';
import { PageService } from './page.service';

import { IPageDocument } from './models/page.model';
import { IPageVersionDocument } from './models/page-version.model';
import { IPublishedPageDocument } from './models/published-page.model';

export class PageController extends ContentController<IPageDocument, IPageVersionDocument, IPublishedPageDocument> {

  private pageService: PageService;
  constructor(pageService: PageService) {
    super(pageService);
    this.pageService = pageService;
  }

  getByUrl = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //need to check isPageDeleted = false
    this.pageService.getPublishedPageByUrl(req.params.url)
      .then(item => res.status(200).json(item))
      .catch(err => next(err));
  }

  getPublishedPageChildren = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.pageService.getPublishedPageChildren(req.params.parentId)
      .then(items => res.status(200).json(items))
      .catch(err => next(err));
  }

  getPageChildren = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.pageService.getPageChildren(req.params.parentId)
      .then(items => res.status(200).json(items))
      .catch(err => next(err));
  }

  //Override insert base
  insert = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const pageDocument = this.pageService.createModelInstance(req.body);

    return this.pageService.executeCreatePageFlow(pageDocument)
      .then(item => res.status(200).json(item))
      .catch(err => next(err))
  }

  update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const pageDocument = this.pageService.createModelInstance(req.body);

    this.pageService.updateAndPublishContent(req.params.id, pageDocument)
      .then((savedPage: IPageDocument) => res.status(200).json(savedPage))
      .catch(error => next(error));
  }


}
