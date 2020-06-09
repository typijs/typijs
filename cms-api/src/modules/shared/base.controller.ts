import * as express from 'express';
import * as httpStatus from 'http-status';
import { IBaseDocument } from './base.model';
import { BaseService } from './base.service';

export abstract class BaseController<T extends IBaseDocument> {
  private baseService: BaseService<T>;
  constructor(baseService: BaseService<T>) {
    this.baseService = baseService;
  }

  getAll = async (req: express.Request, res: express.Response) => {
    const items = await this.baseService.getAll();
    res.status(httpStatus.OK).json(items)
  }

  get = async (req: express.Request, res: express.Response) => {
    const item = await this.baseService.findById(req.params.id).exec()
    res.status(httpStatus.OK).json(item)
  }

  insert = async (req: express.Request, res: express.Response) => {
    const item = await this.baseService.create(req.body)
    res.status(httpStatus.OK).json(item)
  }

  update = async (req: express.Request, res: express.Response) => {
    const item = await this.baseService.updateById(req.params.id, req.body)
    res.status(httpStatus.OK).json(item)
  }

  delete = async (req: express.Request, res: express.Response) => {
    const deleteResult = await this.baseService.deleteById(req.params.id)
    res.status(httpStatus.OK).json(deleteResult)
  }
}