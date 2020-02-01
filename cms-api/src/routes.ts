import { Router } from 'express';

import { asset, media } from './modules/media/media.route';
import { block } from './modules/block/block.route';
import { page } from './modules/page/page.route';
import { sideDefinition } from './modules/site-definition/site-definition.route';

const appRouter: Router = Router();

appRouter.use('/page', page);

// Blocks
appRouter.use('/block', block);

// Media
appRouter.use('/assets', asset);
appRouter.use('/media', media);
appRouter.use(sideDefinition);

export { appRouter };