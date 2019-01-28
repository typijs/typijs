import { Router } from 'express';

import ContentCtrl from './modules/content/content.controller';

import { asset, media } from './modules/media/media.route';
import { block } from './modules/block/block.route';
import { page } from './modules/page/page.route';

const router: Router = Router();

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

router.use('/page', page);

// Blocks
router.use('/block', block);

// Media
router.use('/assets', asset);
router.use('/media', media)

export default router;