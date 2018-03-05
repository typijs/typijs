import * as mongoose from 'mongoose';

import BaseCtrl from '../../base.controller';
import Page from './page.model';
import PageVersion from './page-version.model';

export default class PageCtrl extends BaseCtrl {
  model = Page;
  pageVersion = PageVersion;

  //Override insert base
  insert = (req, res) => {
    const pageObj = new this.model(req.body);

    let urlSegment = pageObj.urlSegment;
    //get page parent
    this.model.findOne({
      _id: pageObj.parentId ? mongoose.Schema.Types.ObjectId(pageObj.parentId) : null
    })
      .then(parentPage => {
        let parentId = parentPage ? parentPage._id : null;

        this.generateUrlSegment(0, urlSegment, parentId).then(urlSegment => {

          pageObj.parentId = parentId;
          pageObj.urlSegment = urlSegment;
          pageObj.isPublished = false;
          pageObj.isDeleted = false;

          //create linkUrl and parent path ids
          if (parentPage) {
            pageObj.linkUrl = parentPage.linkUrl == '/' ? `/${urlSegment}` : `${parentPage.linkUrl}/${urlSegment}`;
            pageObj.parentPath = parentPage.parentPath ? `${parentPage.parentPath}${parentPage._id},` : `,${parentPage._id},`;
            pageObj.ancestors = parentPage.ancestors.slice().push(parentPage._id);
          } else {
            pageObj.linkUrl = `/${urlSegment}`;
            pageObj.parentPath = null;
            pageObj.ancestors = [];
          }

          pageObj.save((err, item) => {
            // 11000 is the code for duplicate key error
            if (err && err.code === 11000) {
              res.sendStatus(400);
            }
            if (err) { return this.handleError(err); }

            res.status(200).json(item);
            //update hasChildren of parent incase successfully insert
            if (parentPage) this.updateHasChildren(parentPage);
          });
        })
      })
      .catch(err => {
        return this.handleError(err);
      })
  }

  update = (req, res) => {
    const pageObj = req.body;
    //isDirty is param which is passed via body request
    const isDirty = pageObj.isDirty;
    const saveAsPublish = req.query.published; //true or false

    this.model.findOne({ _id: req.params.id })
      .then(matchPage => {
        if (!matchPage) return;

        //update existing page
        if (isDirty) {
          matchPage.changed = Date.now();
          //matchPage.changedBy = userId
          matchPage.name = pageObj.name;
          matchPage.properties = pageObj.properties;
          if (saveAsPublish) { matchPage.isPublished = true; }
          matchPage.save((error, result) => {

          });
        } else if (matchPage.isPublished == false && saveAsPublish) {
          matchPage.isPublished = true;
          //save without update 'changed' field
          matchPage.save((error, result) => {

          });
        }

        //publish page (create new version)
        if (saveAsPublish) {
          //get lastest published page
          this.pageVersion.findOne({ originPageId: matchPage._id, isLastPublished: true })
            .then(publishedPage => {
              if (isDirty || (!isDirty && matchPage.changed > publishedPage.published)) {
                //create new version
                this.createPublishedPage(matchPage._id);
              }
            })
        }

        res.sendStatus(200);
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  getByUrl = (req, res) => {
    //need to check isDeleted = false
    this.pageVersion.
      findOne({ linkUrl: req.query.url, isLastPublished: true }).
      populate('childItems.itemId').
      exec((err, item) => {
        if (err) { return this.handleError(err); }
        res.status(200).json(item);
      });
  }

  getAllByParentId = (req, res) => {
    this.model.find({ parentId: req.params.parentId }, (err, items) => {
      if (err) { return this.handleError(err); }
      res.status(200).json(items);
    });
  }

  //get unique url segment for page in one parent
  private generateUrlSegment = (seed: number, orignalUrl: string, parentId: mongoose.Schema.Types.ObjectId, generatedNameInUrl?: string): any =>
    this.model.count({ urlSegment: generatedNameInUrl ? generatedNameInUrl : orignalUrl, parentId: parentId })
      .then(count => {
        if (count > 0) {
          return this.generateUrlSegment(seed + 1, orignalUrl, parentId, `${orignalUrl}-${seed + 1}`);
        }
        return generatedNameInUrl ? generatedNameInUrl : orignalUrl;
      })
      .catch(err => {
        return console.error(err);
      })

  private updateHasChildren = (page: any): any => {
    page.hasChildren = true;
    page.save(function (err) {
      if (err) return this.handleError(err);
    });
  }

  private createPublishedPage(originPageId: mongoose.Schema.Types.ObjectId) {
    //bulk update multi previous published pages
    var bulk = this.pageVersion.collection.initializeOrderedBulkOp();
    bulk.find({ 'originPageId': originPageId }).update({ $set: { isLastPublished: false } });
    bulk.execute((error) => {
      //TODO: insert new published version
      this.model.findById(originPageId)
        .then(page => {
          if (page) {
            const publishedPage = this.pageVersion({
              originPageId: page._id,
              name: page.name,
              urlSegment: page.urlSegment,
              linkUrl: page.linkUrl,

              contentType: page.contentType,
              parentId: page.parentId,

              isLastPublished: true,
              properties: page.properties
            });

            publishedPage.save((error, result) => {

            });
          }
        })
        .catch(error => {

        });
    });
  }



  private handleError = (error: any): any => console.error(error);
}
