import { Router } from 'express';
import { Injectable } from 'injection-js';

import { AuthRouter } from './modules/auth/auth.route';
import { BlockRouter } from './modules/block/block.route';
import { MediaRouter } from './modules/media/media.route';
import { PageRouter } from './modules/page/page.route';
import { SideDefinitionRouter } from './modules/site-definition/site-definition.route';
import { UserRouter } from './modules/user/user.route';

@Injectable()
export class CmsApiRouter {
    constructor(
        private pageRouter: PageRouter,
        private blockRouter: BlockRouter,
        private mediaRouter: MediaRouter,
        private userRouter: UserRouter,
        private authRouter: AuthRouter,
        private siteRouter: SideDefinitionRouter) { }

    get router(): Router {
        const appRouter: Router = Router();
        // Page
        appRouter.use('/page', this.pageRouter.router);
        // Blocks
        appRouter.use('/block', this.blockRouter.router);
        // Media
        appRouter.use('/assets', this.mediaRouter.assetRouter);
        appRouter.use('/media', this.mediaRouter.router);
        // Site Definition
        appRouter.use('/site-definition', this.siteRouter.router);
        // User
        appRouter.use('/user', this.userRouter.router)
        // Auth
        appRouter.use('/auth', this.authRouter.router)
        return appRouter;
    }
}