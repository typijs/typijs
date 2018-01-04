import * as express from 'express';

import ContentCtrl from './controllers/content';
import Content from './models/content';

export default function setRoutes(app) {

  const router = express.Router();
  
  const contentCtrl = new ContentCtrl();

  // Cats
  router.route('/contents').get(contentCtrl.getAll);
  router.route('/contents/count').get(contentCtrl.count);
  router.route('/content').post(contentCtrl.insert);
  router.route('/content/:id').get(contentCtrl.get);
  router.route('/content/:id').put(contentCtrl.update);
  router.route('/content/:id').delete(contentCtrl.delete);
  router.route('/content-by-url').get(contentCtrl.getByUrl);
  router.route('/contents-by-parent/:parentId').get(contentCtrl.getAllByParentId);
  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
