import * as express from 'express';

import { IContentDocument, IContentVersionDocument, IPublishedContentDocument } from './content.model';
import { ContentService } from './content.service';
import { FolderController } from '../folder/folder.controller';

export abstract class ContentController<T extends IContentDocument, V extends IContentVersionDocument & T, P extends IPublishedContentDocument & V> extends FolderController<T> {
  private contentService: ContentService<T, V, P>;

  constructor(contentService: ContentService<T, V, P>) {
    super(contentService.getContentModel());
    this.contentService = contentService;
  }

  get = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.contentService.getPopulatedContentById(req.params.id)
      .then(item => res.status(200).json(item))
      .catch(err => next(err));
  }

  insert = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const contentDocument = this.contentService.createModelInstance(req.body);

    //get parent folder
    this.contentService.executeCreateContentFlow(contentDocument)
      .then(item => res.status(200).json(item))
      .catch(err => next(err))
  }

  delete = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.contentService.executeDeleteContentFlow(req.params.id)
      .then((deleteResult: [T, any]) => res.status(200).json(deleteResult))
      .catch(error => next(error));
  }

  cut = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { sourceContentId, targetParentId } = req.body;
    this.contentService.executeCutContentFlow(sourceContentId, targetParentId)
      .then(item => res.status(200).json(item))
      .catch(error => next(error));
  }

  copy = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { sourceContentId, targetParentId } = req.body;
    this.contentService.executeCopyContentFlow(sourceContentId, targetParentId)
      .then(item => res.status(200).json(item))
      .catch(error => next(error));
  }
}
