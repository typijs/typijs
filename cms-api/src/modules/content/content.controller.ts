import * as express from 'express';
import * as httpStatus from 'http-status';

import { FolderController } from '../folder/folder.controller';
import { ContentVersionService } from './content-version.service';
import { IContentDocument, IContentVersionDocument, IContentLanguageDocument } from './content.model';
import { ContentService } from './content.service';

export abstract class ContentController<T extends IContentDocument, P extends IContentLanguageDocument, V extends IContentVersionDocument> extends FolderController<T, P> {

  constructor(private contentService: ContentService<T, P, V>, private versionService: ContentVersionService<V>) {
    super(contentService);
  }

  /*------------------------CONTENT-----------------------*/

  getSimpleContent = async (req: express.Request, res: express.Response) => {
    const { language } = req as any;
    const createdContent = await this.contentService.getSimpleContent(req.params.id, language);
    res.status(httpStatus.OK).json(createdContent)
  }

  create = async (req: express.Request, res: express.Response) => {
    const { user, language } = req as any;
    const createdContent = await this.contentService.executeCreateContentFlow(req.body, language, user.id);
    res.status(httpStatus.OK).json(createdContent)
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

  /*------------------------VERSION-----------------------*/
  getVersion = async (req: express.Request, res: express.Response) => {
    const { language } = req as any;
    const content = await this.contentService.getContentVersion(req.params.id, req.query.versionId, language)
    res.status(httpStatus.OK).json(content)
  }

  updateVersion = async (req: express.Request, res: express.Response) => {
    const { user } = req as any;
    const savedContent = await this.contentService.executeUpdateContentFlow(req.params.id, req.query.versionId, user.id, req.body)
    res.status(httpStatus.OK).json(savedContent)
  }

  publishVersion = async (req: express.Request, res: express.Response) => {
    const { user } = req as any;
    const publishedContent = await this.contentService.executePublishContentFlow(req.params.id, req.query.versionId, user.id)
    res.status(httpStatus.OK).json(publishedContent)
  }

  getAllVersionsOfContent = async (req: express.Request, res: express.Response) => {
    const content = await this.versionService.getAllVersionsOfContent(req.params.id)
    res.status(httpStatus.OK).json(content)
  }

  setVersionIsPrimary = async (req: express.Request, res: express.Response) => {
    const content = await this.versionService.setPrimaryVersion(req.params.versionId)
    res.status(httpStatus.OK).json(content)
  }

  deleteVersion = async (req: express.Request, res: express.Response) => {
    const user = req['user'];
    const deleteResult = await this.contentService.executeMoveContentToTrashFlow(req.params.versionId, user.id);
    res.status(httpStatus.OK).json(deleteResult)
  }
}
