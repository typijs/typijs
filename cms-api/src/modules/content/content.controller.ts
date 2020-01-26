import * as express from 'express';
import * as mongoose from 'mongoose';

import { IContentDocument, IContentVersionDocument, IPublishedContentDocument } from './content.model';
import { ContentService } from './content.service';
import { FolderCtrl } from '../folder/folder.controller';

export abstract class ContentCtrl<T extends IContentDocument, V extends IContentVersionDocument & T, P extends IPublishedContentDocument & V> extends FolderCtrl<T> {
  private contentService: ContentService<T, V, P>;

  constructor(contentModel: mongoose.Model<T>, contentVersionModel: mongoose.Model<V>, publishedContentModel: mongoose.Model<P>) {
    super(contentModel);
    this.contentService = new ContentService(contentModel, contentVersionModel, publishedContentModel);
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
}
