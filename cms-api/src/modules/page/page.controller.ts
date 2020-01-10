import * as mongoose from 'mongoose';
import * as express from 'express';

import { Page, IPageModel } from './page.model';
import { PageVersion, IPageVersionModel } from './page-version.model';
import { ContentCtrl } from '../content';

import { NotFoundException } from '../../errorHandling';

export class PageCtrl extends ContentCtrl<IPageModel> {

  constructor() { super(Page); }

  pageVersion = PageVersion;

  get = (req, res, next) => {
    this.model.findOne({ _id: req.params.id })
      .populate('childItems.itemId')
      .exec()
      .then(item => res.status(200).json(item))
      .catch(err => next(err));
  }

  //Override insert base
  insert = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const pageObj = new this.model(req.body);

    let urlSegment = pageObj.urlSegment;
    //get page parent
    this.model.findOne({ _id: pageObj.parentId ? pageObj.parentId : null }).exec()
      .then((parentPage: IPageModel) => {
        let parentId = parentPage ? parentPage._id : null;

        return this.generateUrlSegment(0, urlSegment, parentId).then(urlSegment => [urlSegment, parentPage, parentId])
      })
      .then(([urlSegment, parentPage, parentId]) => {

        pageObj.parentId = parentId;
        pageObj.urlSegment = urlSegment;
        pageObj.isPublished = false;
        pageObj.isContentDeleted = false;

        //create linkUrl and parent path ids
        if (parentPage) {
          pageObj.linkUrl = parentPage.linkUrl == '/' ? `/${urlSegment}` : `${parentPage.linkUrl}/${urlSegment}`;
          pageObj.parentPath = parentPage.parentPath ? `${parentPage.parentPath}${parentPage._id},` : `,${parentPage._id},`;
          let ancestors = parentPage.ancestors.slice();
          ancestors.push(parentPage._id);
          pageObj.ancestors = ancestors
        } else {
          pageObj.linkUrl = `/${urlSegment}`;
          pageObj.parentPath = null;
          pageObj.ancestors = [];
        }

        return pageObj.save().then(item => [item, parentPage]);
      })
      .then(([item, parentPage]) => {
        if (parentPage) return this.updateHasChildren(parentPage).then(() => item);
        return Promise.resolve(item);
      })
      .then(item => res.status(200).json(item))
      .catch(err => next(err))
  }

  update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const pageObj = req.body;
    //isDirty is param which is passed via body request
    const isDirty = pageObj.isDirty;
    const saveAsPublish = pageObj.isPublished; //true or false

    this.model.findOne({ _id: req.params.id }).exec()
      .then((matchPage: IPageModel) => {
        if (!matchPage) throw new NotFoundException(req.params.id);

        //update existing page
        if (isDirty) {
          matchPage.changed = new Date();
          //matchPage.changedBy = userId
          matchPage.name = pageObj.name;
          matchPage.childItems = pageObj.childItems;
          matchPage.properties = pageObj.properties;
          if (saveAsPublish) { matchPage.isPublished = true; }

          return matchPage.save();
        }
        else if (matchPage.isPublished == false && saveAsPublish) {
          matchPage.isPublished = true;
          //save without update 'changed' field
          return matchPage.save();
        }

        return Promise.resolve(matchPage);
      })
      .then((matchPage: IPageModel) => {

        //publish page (create new version)
        if (saveAsPublish) {
          //get lastest published page
          return this.pageVersion.findOne({ originPageId: matchPage._id, isLastPublished: true }).exec()
            .then((publishedPage: IPageVersionModel) => {
              if (isDirty || !publishedPage || (!isDirty && matchPage.changed > publishedPage.published)) {
                //create new version
                return this.createPublishedPage(matchPage._id);
              }
            })
        }

        return Promise.resolve(null)
      })
      .then(() => res.status(200).json("Update successfully"))
      .catch(error => {
        next(error);
      });
  }

  getByUrl = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //need to check isPageDeleted = false
    this.pageVersion.findOne({ linkUrl: req.query.url, isLastPublished: true })
      .populate('childItems.itemId')
      .exec()
      .then(item => res.status(200).json(item))
      .catch(err => next(err));
  }

  getAllByParentId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let parentId = req.params.parentId != '0' ? req.params.parentId : null;
    this.model.find({ parentId: parentId }).exec()
      .then(items => res.status(200).json(items))
      .catch(err => next(err));
  }

  //get unique url segment for page in one parent
  private generateUrlSegment = (seed: number, orignalUrl: string, parentId: mongoose.Schema.Types.ObjectId, generatedNameInUrl?: string): Promise<string> =>
    this.model.count({ urlSegment: generatedNameInUrl ? generatedNameInUrl : orignalUrl, parentId: parentId }).exec()
      .then(count => {
        if (count > 0) {
          return this.generateUrlSegment(seed + 1, orignalUrl, parentId, `${orignalUrl}-${seed + 1}`);
        }
        return Promise.resolve(generatedNameInUrl ? generatedNameInUrl : orignalUrl);
      })

  private createPublishedPage(originPageId: mongoose.Schema.Types.ObjectId): Promise<IPageVersionModel> {
    return this.pageVersion.updateMany({ 'originPageId': originPageId }, { $set: { isLastPublished: false } })
      .then(() => this.model.findById(originPageId))
      .then((page: IPageModel) => {
        if (!page) throw new NotFoundException(originPageId.toString());

        const publishedPage = new this.pageVersion({
          originPageId: page._id,
          name: page.name,
          urlSegment: page.urlSegment,
          linkUrl: page.linkUrl,
          contentType: page.contentType,
          parentId: page.parentId,
          isLastPublished: true,
          childItems: page.childItems,
          properties: page.properties
        });

        return publishedPage.save();
      })
  }

}
