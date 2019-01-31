abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = (req, res) => {
    this.model.find({})
      .then(items => res.status(200).json(items))
      .catch(err => this.handleError(err));
  }

  // Count all
  count = (req, res) => {
    this.model.count({})
      .then(count => res.status(200).json(count))
      .catch(err => this.handleError(err));
  }

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save()
      .then(item => res.status(200).json(item))
      .catch(err => {
        this.handleError(err);
        if (err && err.code === 11000) {
          res.sendStatus(400);
        }
      })
  }

  // Get by id
  get = (req, res, next) => {
    this.model.findOne({ _id: req.params.id })
      .then(item => res.status(200).json(item))
      .catch(err => this.handleError(err));
  }

  // Update by id
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => res.sendStatus(200))
      .catch(err => this.handleError(err));
  }

  // Delete by id
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id })
      .then(() => res.sendStatus(200))
      .catch(err => this.handleError(err));
  }

  handleError = (error: any): any => console.error(error);
}

export { BaseCtrl }
