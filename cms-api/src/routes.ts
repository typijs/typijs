import { Application, Router } from 'express';
import { ReflectiveInjector } from 'injection-js';

import { AuthRouter } from './modules/auth/auth.route';
import { BlockRouter } from './modules/block/block.route';
import { AssetRouter, MediaRouter } from './modules/media/media.route';
import { PageRouter } from './modules/page/page.route';
import { SideDefinitionRouter } from './modules/site-definition/site-definition.route';
import { UserRouter } from './modules/user/user.route';

export class AppRouter {
    private injector: ReflectiveInjector;
    public router: Router;
    constructor(app: Application) {
        this.injector = app.get('injector');
        this.router = this.getRouter();
    }

    private getRouter(): Router {
        const appRouter: Router = Router();
        // Page
        appRouter.use('/page', new PageRouter(this.injector).router);
        // Blocks
        appRouter.use('/block', new BlockRouter(this.injector).router);
        // Media
        appRouter.use('/assets', new AssetRouter(this.injector).router);
        appRouter.use('/media', new MediaRouter(this.injector).router);
        // Site Definition
        appRouter.use('/site-definition', new SideDefinitionRouter(this.injector).router);
        // User
        appRouter.use('/user', new UserRouter(this.injector).router)
        // Auth
        appRouter.use('/auth', new AuthRouter(this.injector).router)
        return appRouter;
    }
}