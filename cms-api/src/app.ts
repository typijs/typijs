import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Provider } from 'injection-js';
import { CacheInjectorProviders } from "./caching";
import { config } from './config/config';
import { Database } from './db/database';
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
  provides?: Provider[]
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
        resolve();
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
      ...AuthProviders,
      ...BlockProviders,
      ...MediaProviders,
      ...StorageProviders,
      ...PageProviders,
      ...SiteDefinitionProviders,
      ...UserProviders,
      ...LanguageProviders,
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