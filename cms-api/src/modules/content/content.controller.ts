import * as express from 'express';
import * as httpStatus from 'http-status';

import { FolderController } from '../folder/folder.controller';
import { IContentDocument, IContentVersionDocument, IPublishedContentDocument } from './content.model';
import { ContentService } from './content.service';

export abstract class ContentController<T extends IContentDocument, V extends IContentVersionDocument & T, P extends IPublishedContentDocument & V> extends FolderController<T> {
  private contentService: ContentService<T, V, P>;

  constructor(contentService: ContentService<T, V, P>) {
    super(contentService);
    this.contentService = contentService;
  }

  get = async (req: express.Request, res: express.Response) => {
    const item = await this.contentService.getPopulatedContentById(req.params.id)
    res.status(httpStatus.OK).json(item)
  }

  create = async (req: express.Request, res: express.Response) => {
    const item = await this.contentService.executeCreateContentFlow(req.body)
    res.status(httpStatus.OK).json(item)
  }

  delete = async (req: express.Request, res: express.Response) => {
    const deleteResult = await this.contentService.executeDeleteContentFlow(req.params.id)
    res.status(httpStatus.OK).json(deleteResult)
  }

  cut = async (req: express.Request, res: express.Response) => {
    const { sourceContentId, targetParentId } = req.body;
    const item = await this.contentService.executeCutContentFlow(sourceContentId, targetParentId)
    res.status(httpStatus.OK).json(item)
  }

  copy = async (req: express.Request, res: express.Response) => {
    const { sourceContentId, targetParentId } = req.body;
    const item = await this.contentService.executeCopyContentFlow(sourceContentId, targetParentId)
    res.status(httpStatus.OK).json(item)
  }
}
