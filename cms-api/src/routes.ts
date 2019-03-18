import { Router } from 'express';

import ContentCtrl from './modules/content/content.controller';

import { asset, media } from './modules/media/media.route';
import { block } from './modules/block/block.route';
import { page } from './modules/page/page.route';
import { sideDefinition } from './modules/site-definition/site-definition.route';

const appRouter: Router = Router();

// Contents
const contentCtrl = new ContentCtrl();
appRouter.route('/contents').get(contentCtrl.getAll);
appRouter.route('/contents/count').get(contentCtrl.count);
appRouter.route('/content').post(contentCtrl.insert);
appRouter.route('/content/:id').get(contentCtrl.get);
appRouter.route('/content/:id').put(contentCtrl.update);
appRouter.route('/content/:id').delete(contentCtrl.delete);
appRouter.route('/content-by-url').get(contentCtrl.getByUrl);
appRouter.route('/contents-by-parent/:parentId').get(contentCtrl.getAllByParentId);

appRouter.use('/page', page);

// Blocks
appRouter.use('/block', block);

// Media
appRouter.use('/assets', asset);
appRouter.use('/media', media);
appRouter.use(sideDefinition);

export { appRouter };