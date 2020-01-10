import * as express from 'express';
import * as mongoose from 'mongoose';

import { BaseCtrl } from '../base.controller';
import { IContentModel } from './content.model';
import { NotFoundException } from '../../errorHandling';

export abstract class ContentCtrl<T extends IContentModel> extends BaseCtrl<mongoose.Model<T>> {
  //Create new folder
  createContent = (req, res, next) => {
    const mediaObj = new this.model(req.body);

    //get parent folder
    this.model.findOne({ _id: mediaObj.parentId ? mediaObj.parentId : null }).exec()
      .then((parentFolder: IContentModel) => {
        let parentId = parentFolder ? parentFolder._id : null;

        mediaObj.parentId = parentId;
        mediaObj.isContentDeleted = false;

        //create linkUrl and parent path ids
        if (parentFolder) {
          mediaObj.parentPath = parentFolder.parentPath ? `${parentFolder.parentPath}${parentFolder._id},` : `,${parentFolder._id},`;
        } else {
          mediaObj.parentPath = null;
        }

        return mediaObj.save().then(item => [item, parentFolder])
      })
      .then(([item, parentFolder]) => {
        return parentFolder ? this.updateHasChildren(parentFolder).then(() => item) : Promise.resolve(item);
      })
      .then(item => {
        res.status(200).json(item);
      })
      .catch(err => {
        next(err);
      })
  }

  updateContent = (req, res, next) => {
    const mediaObj = req.body;

    this.model.findOne({ _id: req.params.id })
      .then(matchFolder => {
        if (!matchFolder) throw new NotFoundException(req.params.id);

        //update existing page
        matchFolder.changed = new Date();
        //matchPage.changedBy = userId
        matchFolder.name = mediaObj.name;
        return matchFolder.save();
      })
      .then(item => {
        if (item) {
          res.status(200).json(item);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        next(err);
      });
  }

  getFoldersByParentId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let parentId = req.params.parentId != '0' ? req.params.parentId : null;
    this.model.find({ parentId: parentId, contentType: null })
      .then(items => {
        res.status(200).json(items);
      })
      .catch(err => {
        next(err);
      })
  }

  getContentsByFolder = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let parentId = req.params.parentId != '0' ? req.params.parentId : null;
    this.model.find({ parentId: parentId, contentType: { $ne: null } })
      .then(items => {
        res.status(200).json(items);
      })
      .catch(err => {
        next(err);
      })
  }

  protected updateHasChildren = (content: IContentModel): Promise<IContentModel> => {
    content.hasChildren = true;
    return content.save();
  }
}
