import { string } from '@hapi/joi';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Provider } from 'injection-js';
import { CacheInjectorProviders } from "./caching";
import { config } from './config/config';
import { Database } from './db/database';
import { bindCurrentNamespace, setCurrentTenantId } from './db/storage';
import { errorMiddleware } from './error';
import { EventInjectorProviders } from "./event";
import { Container } from './injector';
import { logger, LoggerProviders, loggingMiddleware } from './logging';
import { AuthProviders } from "./modules/auth";
import { BlockProviders } from './modules/block';
import { LanguageProviders } from "./modules/language";
import { MediaProviders, StorageProviders } from './modules/media';
import { PageProviders } from './modules/page';
import { SiteDefinitionProviders } from "./modules/site-definition";
import { UserProviders } from "./modules/user";
import { CmsApiRouter } from './routes';

export type CmsAppOptions = {
  mongodbConnection?: string,
  multiTenant?: boolean,
  tenantDbs?: TenantDb[],
  provides?: Provider[]
}

export class TypiJs {
  constructor(private express: express.Application, appOptions: CmsAppOptions = {}) {
    this.setProviders(appOptions.provides);
    this.setDatabaseConnection(appOptions.mongodbConnection);
    if (appOptions.multiTenant) this.setNamespace();
  }

  get router(): express.Router {
    const apiRouter = Container.get(CmsApiRouter);
    return apiRouter.router;
  }

  get errorHandler() {
    return errorMiddleware.errorHandler()
  }

  private setProviders(providers: Provider[]) {
    let appProviders = [
      ...LoggerProviders,
      ...EventInjectorProviders,
      ...CacheInjectorProviders,
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
    if (providers) {
      appProviders = [...appProviders, ...providers];
    }
    Container.set(appProviders);
  }

  private setDatabaseConnection(connection: string) {
    (new Database()).connect();
  }

  private setNamespace(): void {
    this.express.use(bindCurrentNamespace)
    this.express.use((req, res, next) => {
      const host: string = req.get('host') //return hostname + port: ex localhost:3000
      setCurrentTenantId(host);
      next();
    })
  }
}

export class CmsApp {
  public express: express.Application;

  constructor(appOptions: CmsAppOptions = {}) {
    this.express = express();
    this.setProviders(appOptions.provides)
    this.setDatabaseConnection();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandling();
  }

  public start(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.express.listen(config.app.port, () => {
        console.log(`Angular CMS listening on port ${config.app.port}`);
        resolve('Start successfully!');
      }).on('error', (err: any) => {
        logger.error('Server can not start', err);
        reject(err);
      });
    });
  }

  private setProviders(providers: Provider[]) {
    let appProviders = [
      ...LoggerProviders,
      ...EventInjectorProviders,
      ...CacheInjectorProviders,
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
    if (providers) {
      appProviders = [...appProviders, ...providers];
    }
    Container.set(appProviders);
  }

  private setDatabaseConnection() {
    (new Database()).connect();
  }

  private setMiddlewares(): void {
    this.express.use(bindCurrentNamespace)
    this.express.use((req, res, next) => {
      // Get current user from session or token

      // Get current tenant from user here
      // Make sure its a string

      //setCurrentTenantId(req.hostname);
      setCurrentTenantId('localhost:3000');
      next();
    })

    //enable CORS - Cross Origin Resource Sharing
    //https://expressjs.com/en/resources/middleware/cors.html
    this.express.use(cors({
      origin: config.app.origin.split(','), credentials: true
    }));
    // request logging
    this.express.use(loggingMiddleware());
    // parse body params and attache them to req.body
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    //gzip compression
    //this.express.use(compress());
    //this.express.use(helmet());
  }

  private setRoutes(): void {
    const apiRouter = Container.get(CmsApiRouter);
    this.express.use('/api', apiRouter.router);
  }

  private setErrorHandling(): void {
    //add middleware to convert all errors to AppError class
    this.express.use(errorMiddleware.errorConverter());
    //handler for all errors
    this.express.use(errorMiddleware.errorHandler());
  }
}