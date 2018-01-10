import * as express from 'express';
import ContentCtrl from './modules/content/content.controller';
import BlockCtrl from './modules/block/block.controller';


export function setRoutes(app) {
  const router = express.Router();

  // Contents
  const contentCtrl = new ContentCtrl();
  router.route('/contents').get(contentCtrl.getAll);
  router.route('/contents/count').get(contentCtrl.count);
  router.route('/content').post(contentCtrl.insert);
  router.route('/content/:id').get(contentCtrl.get);
  router.route('/content/:id').put(contentCtrl.update);
  router.route('/content/:id').delete(contentCtrl.delete);
  router.route('/content-by-url').get(contentCtrl.getByUrl);
  router.route('/contents-by-parent/:parentId').get(contentCtrl.getAllByParentId);

  // Blocks
  const blockCtrl = new BlockCtrl();
  router.route('/blocks').get(blockCtrl.getAll);
  router.route('/block/count').get(blockCtrl.count);
  router.route('/block').post(blockCtrl.insert);
  router.route('/block/:id').get(blockCtrl.get);
  router.route('/block/:id').put(blockCtrl.update);
  router.route('/block/:id').delete(blockCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
