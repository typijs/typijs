import * as express from 'express';
import * as httpStatus from 'http-status';

import { pick } from '../../utils/pick';
import { IBaseDocument, PaginateOptions } from './base.model';
import { BaseService } from './base.service';

export abstract class BaseController<T extends IBaseDocument> {
  protected baseService: BaseService<T>;
  constructor(baseService: BaseService<T>) {
    this.baseService = baseService;
  }

  getAll = async (req: express.Request, res: express.Response) => {
    const items = await this.baseService.getAll().exec();
    res.status(httpStatus.OK).json(items)
  }

  get = async (req: express.Request, res: express.Response) => {
    const item = await this.baseService.findById(req.params.id).exec()
    res.status(httpStatus.OK).json(item)
  }

  paginate = async (req: express.Request, res: express.Response) => {
    const options = pick(req.query, ['sortBy', 'limit', 'page']) as PaginateOptions;
    const result = await this.baseService.paginate({}, options);
    res.status(httpStatus.OK).json(result);
  };

  create = async (req: express.Request, res: express.Response) => {
    const { id } = req['user'];
    const newDoc: Partial<T> = Object.assign({ createdBy: id }, req.body);
    const item = await this.baseService.create(newDoc)
    res.status(httpStatus.OK).json(item)
  }

  update = async (req: express.Request, res: express.Response) => {
    const { id } = req['user'];
    const doc: Partial<T> = Object.assign({ updatedBy: id }, req.body);
    const item = await this.baseService.updateById(req.params.id, doc)
    res.status(httpStatus.OK).json(item)
  }

  delete = async (req: express.Request, res: express.Response) => {
    const deleteResult = await this.baseService.deleteById(req.params.id)
    res.status(httpStatus.OK).json(deleteResult)
  }
}