import * as express from 'express';

abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.model.find({})
      .then(items => res.status(200).json(items))
      .catch(err => next(err));
  }

  // Count all
  count = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.model.count({})
      .then(count => res.status(200).json(count))
      .catch(err => next(err));
  }

  // Insert
  insert = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const obj = new this.model(req.body);
    obj.save()
      .then(item => res.status(200).json(item))
      .catch(err => next(err));
  }

  // Get by id
  get = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.model.findOne({ _id: req.params.id })
      .then(item => res.status(200).json(item))
      .catch(err => next(err));
  }

  // Update by id
  update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => res.sendStatus(200))
      .catch(err => next(err));
  }

  // Delete by id
  delete = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.model.findOneAndRemove({ _id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(err => next(err));
  }
}

export { BaseCtrl }
