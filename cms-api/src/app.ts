import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Provider } from 'injection-js';
import { config } from './config/config';
import { GlobalInjector } from './constants';
import { Database } from './db/database';
import { errorMiddleware } from './error';
import { CmsInjector } from './injector';
import { loggingMiddleware, logger } from './logging';
import { CmsApiRouter } from './routes';

export type CmsAppOptions = {
  provides?: Provider[]
}

export class CmsApp {
  public express: express.Application;

  constructor(appOptions: CmsAppOptions = {}) {
    this.express = express();
    this.express.set(GlobalInjector, new CmsInjector(appOptions.provides).instance);
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
    const cmsInjector = this.express.get(GlobalInjector);
    const apiRouter = <CmsApiRouter>cmsInjector.get(CmsApiRouter);
    this.express.use('/api', apiRouter.router);
  }

  private setErrorHandling(): void {
    //add middleware to convert all errors to AppError class
    this.express.use(errorMiddleware.errorConverter());
    //handler for all errors
    this.express.use(errorMiddleware.errorHandler());
  }
}