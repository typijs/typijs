import * as express from 'express';
import { Provider } from 'injection-js';
import { CacheInjectorProviders } from "./caching";
import { ConfigManager, TypiJsConfig } from './config';
import { Database, TenantDatabases } from './db';
import { errorMiddleware } from './error';
import { EventInjectorProviders } from "./event";
import { HttpClientProviders } from './http';
import { Container } from './injector';
import { LoggerProviders, loggingMiddleware } from './logging';
import { AuthProviders } from "./modules/auth";
import { BlockProviders } from './modules/block';
import { LanguageProviders } from "./modules/language";
import { MediaProviders, StorageProviders } from './modules/media';
import { PageProviders } from './modules/page';
import { SiteDefinitionProviders } from "./modules/site-definition";
import { UserProviders } from "./modules/user";
import { RequestContext, TenantContext } from './request-context';
import { CmsApiRouter } from './routes';

export class TypiJs {
  constructor(private express: express.Application, appConfig?: TypiJsConfig) {
    this.setConfig(appConfig);
    this.setSystemProvider();
    this.setDatabaseConnection();
    this.setAppProviders(appConfig.provides);
    this.setLoggingMiddleware();
  }

  get apiRouter(): express.Router {
    const apiRouter = Container.get(CmsApiRouter);
    return apiRouter.router;
  }

  get errorHandler() {
    return errorMiddleware.errorHandler()
  }

  private setConfig(config: TypiJsConfig) {
    ConfigManager.setConfig(config);
  }

  private setSystemProvider() {
    let systemProviders = [
      ...LoggerProviders,
      ...CacheInjectorProviders,
      ...EventInjectorProviders,
      ...HttpClientProviders
    ];

    Container.set(systemProviders);
  }

  private setAppProviders(customProviders: Provider[]) {
    let appProviders = [
      ...LanguageProviders,
      ...StorageProviders,
      ...UserProviders,
      ...AuthProviders,
      ...SiteDefinitionProviders,
      ...BlockProviders,
      ...MediaProviders,
      ...PageProviders,
      CmsApiRouter
    ];
    if (customProviders) {
      appProviders = [...appProviders, ...customProviders];
    }
    Container.set(appProviders);
  }

  private setDatabaseConnection() {
    const config = ConfigManager.getConfig();

    if (config.mongdb.multiTenant) {
      this.setRequestContext();
      this.setTenantContext();
      // Multi tenant mode using multi connections to MongoDB
      TenantDatabases.connect(config.mongdb.tenantConnects, config.mongdb.tenantHosts);
    } else {
      // Single mode using the default mongoose connection
      Database.connect(config.mongdb.connection);
    };
  }

  private setRequestContext() {
    this.express.use(RequestContext.middleware)
  }

  private setTenantContext(): void {
    this.express.use((req, res, next) => {
      //get hostname + port: ex localhost:3000
      const host: string = req.get('host')
      TenantContext.setCurrentTenantId(host);
      next();
    })
  }

  private setLoggingMiddleware(): void {
    this.express.use(loggingMiddleware());
  }
}