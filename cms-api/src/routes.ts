import { Router } from 'express';

import { asset, media } from './modules/media/media.route';
import { block } from './modules/block/block.route';
import { page } from './modules/page/page.route';
import { user } from './modules/user/user.route';
import { authRouter } from './modules/auth/auth.route';
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
appRouter.use('/site-definition', sideDefinition);
appRouter.use('/user', user)
appRouter.use('/auth', authRouter)

export { appRouter };