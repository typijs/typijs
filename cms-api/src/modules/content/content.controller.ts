import * as express from 'express';
import * as httpStatus from 'http-status';

import { FolderController } from '../folder/folder.controller';
import { IContentDocument, IContentVersionDocument, IContentLanguageDocument } from './content.model';
import { ContentService } from './content.service';

export abstract class ContentController<T extends IContentDocument, P extends IContentLanguageDocument, V extends IContentVersionDocument> extends FolderController<T, P> {

  constructor(private contentService: ContentService<T, P, V>) {
    super(contentService);
  }

  get = async (req: express.Request, res: express.Response) => {
    const { language } = req as any;
    const content = await this.contentService.getPrimaryVersionOfContentById(req.params.id, language)
    res.status(httpStatus.OK).json(content)
  }

  create = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;
    const createdContent = await this.contentService.executeCreateContentFlow(req.body, user.id, language);
    res.status(httpStatus.OK).json(createdContent)
  }

  update = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;
    const savedContent = await this.contentService.executeUpdateContentFlow(req.params.id, req.body, user.id, language)
    res.status(httpStatus.OK).json(savedContent)
  }

  publish = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;
    const publishedContent = await this.contentService.executePublishContentFlow(req.params.id, user.id, language)
    res.status(httpStatus.OK).json(publishedContent)
  }

  delete = async (req: express.Request, res: express.Response) => {
    const user = req['user'];
    const deleteResult = await this.contentService.executeMoveContentToTrashFlow(req.params.id, user.id);
    res.status(httpStatus.OK).json(deleteResult)
  }

  moveToTrash = async (req: express.Request, res: express.Response) => {
    const user = req['user'];
    const deleteResult = await this.contentService.executeMoveContentToTrashFlow(req.params.id, user.id);
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
