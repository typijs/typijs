import * as express from 'express';
import * as httpStatus from 'http-status';

import { FolderController } from '../folder/folder.controller';
import { IContentDocument, IContentVersionDocument, IContentLanguageDocument } from './content.model';
import { ContentService } from './content.service';

export abstract class ContentController<T extends IContentDocument, P extends IContentLanguageDocument, V extends IContentVersionDocument> extends FolderController<T, P> {
  private contentService: ContentService<T, P, V>;

  constructor(contentService: ContentService<T, P, V>) {
    super(contentService);
    this.contentService = contentService;
  }

  get = async (req: express.Request, res: express.Response) => {
    const item = await this.contentService.getPopulatedContentById(req.params.id, req.query.language)
    res.status(httpStatus.OK).json(item)
  }

  create = async (req: express.Request, res: express.Response) => {
    const content = Object.assign({ languageId: req.query.language }, req.body);
    const user = req['user'];
    const item = await this.contentService.executeCreateContentFlow(content, user.id);
    res.status(httpStatus.OK).json(item)
  }

  delete = async (req: express.Request, res: express.Response) => {
    const user = req['user'];
    const deleteResult = await this.contentService.executeDeleteContentFlow(req.params.id, user.id);
    res.status(httpStatus.OK).json(deleteResult)
  }

  cut = async (req: express.Request, res: express.Response) => {
    const { sourceContentId, targetParentId } = req.body;
    const user = req['user'];
    const item = await this.contentService.executeCutContentFlow(sourceContentId, targetParentId, user.id)
    res.status(httpStatus.OK).json(item)
  }

  copy = async (req: express.Request, res: express.Response) => {
    const { sourceContentId, targetParentId } = req.body;
    const user = req['user'];
    const item = await this.contentService.executeCopyContentFlow(sourceContentId, targetParentId, user.id)
    res.status(httpStatus.OK).json(item)
  }
}
