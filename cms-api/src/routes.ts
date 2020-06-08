import { Router } from 'express';

import { asset, media } from './modules/media/media.route';
import { block } from './modules/block/block.route';
import { page } from './modules/page/page.route';
import { user } from './modules/user/user.route';
import { sideDefinition } from './modules/site-definition/site-definition.route';

const appRouter: Router = Router();
// Page
appRouter.use('/page', page);
// Blocks
appRouter.use('/block', block);
// Media
appRouter.use('/assets', asset);
appRouter.use('/media', media);
// Site Definition
appRouter.use(sideDefinition);
appRouter.use('/user', user)

export { appRouter };