import * as Joi from '@hapi/joi';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { AdminOrEditor } from '../../constants';
import { Profiler } from '../../logging';
import { ValidateBody, ValidateParams, ValidateQuery } from '../../validation/validate.decorator';
import { Authorize } from '../auth/auth.decorator';

import { FolderController } from '../folder/folder.controller';
import { ContentVersionService } from './content-version.service';
import { IContentDocument, IContentVersionDocument, IContentLanguageDocument } from './content.model';
import { ContentService } from './content.service';

export abstract class ContentController<T extends IContentDocument, P extends IContentLanguageDocument, V extends IContentVersionDocument> extends FolderController<T, P> {

  constructor(private contentService: ContentService<T, P, V>, private versionService: ContentVersionService<V>) {
    super(contentService);
  }

  /*------------------------CONTENT-----------------------*/

  async getContent(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const createdContent = await this.contentService.getContent(req.params.id, language);
    res.status(httpStatus.OK).json(createdContent)
  }

  async getContentItems(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const { ids, statuses, project, isDeepPopulate } = req.body;
    const items = await this.contentService.getContentItems(ids, language, statuses, project, isDeepPopulate);
    res.status(httpStatus.OK).json(items);
  }

  async queryContent(req: express.Request, res: express.Response) {
    const { filter, page, limit, sort, project } = req.body;
    const items = await this.contentService.queryContent(filter, page, limit, sort, project);
    res.status(httpStatus.OK).json(items);
  }

  @Profiler({
    outputConsole: true,
    thresholdInMs: 300,
    parametersAsString: (args) => `${args[0].params.parentId}, ${args[0]['language']}, ${args[0].query.host}`
  })
  async getContentChildren(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const items = await this.contentService.getContentChildren(req.params.parentId, language, req.query.host);
    res.status(httpStatus.OK).json(items)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateBody({
    name: Joi.string().required(),
    contentType: Joi.string().required()
  })
  async createContent(req: express.Request, res: express.Response) {
    const { user, language } = req as any;
    const createdContent = await this.contentService.executeCreateContentFlow(req.body, language, user.id);
    res.status(httpStatus.OK).json(createdContent)
  }

  @Authorize({ roles: AdminOrEditor })
  async deleteContent(req: express.Request, res: express.Response) {
    const user = req['user'];
    const deleteResult = await this.contentService.executeMoveContentToTrashFlow(req.params.id, user.id);
    res.status(httpStatus.OK).json(deleteResult)
  }

  @Authorize({ roles: AdminOrEditor })
  async moveToTrash(req: express.Request, res: express.Response) {
    const user = req['user'];
    const deleteResult = await this.contentService.executeMoveContentToTrashFlow(req.params.id, user.id);
    res.status(httpStatus.OK).json(deleteResult)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateBody({
    sourceContentId: Joi.string().required(),
    targetParentId: Joi.string().required()
  })
  async cut(req: express.Request, res: express.Response) {
    const { sourceContentId, targetParentId } = req.body;
    const user = req['user'];
    const item = await this.contentService.executeCutContentFlow(sourceContentId, targetParentId, user.id)
    res.status(httpStatus.OK).json(item)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateBody({
    sourceContentId: Joi.string().required(),
    targetParentId: Joi.string().required()
  })
  async copy(req: express.Request, res: express.Response) {
    const { sourceContentId, targetParentId } = req.body;
    const user = req['user'];
    const item = await this.contentService.executeCopyContentFlow(sourceContentId, targetParentId, user.id)
    res.status(httpStatus.OK).json(item)
  }

  /*------------------------VERSION-----------------------*/
  @Authorize({ roles: AdminOrEditor })
  async getVersion(req: express.Request, res: express.Response) {
    const { language } = req as any;
    const content = await this.contentService.getContentVersion(req.params.id, req.query.versionId, language, req.query.host)
    res.status(httpStatus.OK).json(content)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateQuery({ versionId: Joi.string().required() })
  async updateVersion(req: express.Request, res: express.Response) {
    const { user } = req as any;
    const savedContent = await this.contentService.executeUpdateContentFlow(req.params.id, req.query.versionId, user.id, req.body)
    res.status(httpStatus.OK).json(savedContent)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateQuery({ versionId: Joi.string().required() })
  async publishVersion(req: express.Request, res: express.Response) {
    const { user } = req as any;
    const publishedContent = await this.contentService.executePublishContentFlow(req.params.id, req.query.versionId, user.id, req.query.host)
    res.status(httpStatus.OK).json(publishedContent)
  }

  @Authorize({ roles: AdminOrEditor })
  async getAllVersionsOfContent(req: express.Request, res: express.Response) {
    const content = await this.versionService.getAllVersionsOfContent(req.params.id)
    res.status(httpStatus.OK).json(content)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateParams({ versionId: Joi.string().required() })
  async setVersionIsPrimary(req: express.Request, res: express.Response) {
    const content = await this.versionService.setPrimaryVersion(req.params.versionId)
    res.status(httpStatus.OK).json(content)
  }

  @Authorize({ roles: AdminOrEditor })
  @ValidateParams({ versionId: Joi.string().required() })
  async deleteVersion(req: express.Request, res: express.Response) {
    const user = req['user'];
    const deleteResult = await this.contentService.executeMoveContentToTrashFlow(req.params.versionId, user.id);
    res.status(httpStatus.OK).json(deleteResult)
  }
}
