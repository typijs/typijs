import BaseCtrl from '../../base.controller';
import Content from './content.model';

const emptyObjectId = '000000000000000000000000'

export default class ContentCtrl extends BaseCtrl {
  model = Content;

  //Override insert base
  insert = (req, res) => {
    const obj = new this.model(req.body);
    let nameInUrl = obj.nameInUrl;
    this.model.findOne({ _id: obj.parentId }).then(parent => {
      let parentId = parent ? `${parent._id}` : emptyObjectId;
      this.generateNameInUrl(0, nameInUrl, parentId).then(url => {
        obj.nameInUrl = url;
        obj.linkUrl = parent ? `${parent.linkUrl}/${url}` : `/${url}`;
        obj.parentId = parentId;
        obj.save((err, item) => {
          // 11000 is the code for duplicate key error
          if (err && err.code === 11000) {
            res.sendStatus(400);
          }
          if (err) {
            return console.error(err);
          }
          res.status(200).json(item);
        });
      })
    })

  }

  getByUrl = (req, res) => {
    this.model.findOne({ linkUrl: req.query.url }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  getAllByParentId = (req, res) => {
    this.model.find({ parentId: req.params.parentId }, (err, items) => {
      if (err) { return console.error(err); }
      res.status(200).json(items);
    });
  }

  private generateNameInUrl = (index: number, orignalUrl: string, parentId: string, generatedNameInUrl?: string): any =>
  this.model.count({ 'nameInUrl': generatedNameInUrl ? generatedNameInUrl : orignalUrl, 'parentId': parentId })
    .then(count => {
      console.log(count);
      if (count > 0) {
        return this.generateNameInUrl(index + 1, orignalUrl, parentId, `${orignalUrl}-${index + 1}`);
      }
      return generatedNameInUrl ? generatedNameInUrl : orignalUrl;
    })
    .catch(err => {
      return console.error(err);
    })
}
