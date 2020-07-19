import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';

import { config } from './config/config';
import { Database } from './db/database';
import { errorMiddleware } from './error';
import { injector } from './injector';
import { loggingMiddleware } from './logging';
import { AppRouter } from './routes';

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.express.set('injector', injector);
    this.setDatabaseConnection();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandling();
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
    const appInjector = this.express.get('injector');
    const appRouter = <AppRouter>appInjector.get(AppRouter);
    this.express.use('/api', appRouter.router);
  }

  private setErrorHandling(): void {
    //add middleware to convert all errors to AppError class
    this.express.use(errorMiddleware.errorConverter());
    //handler for all errors
    this.express.use(errorMiddleware.errorHandler());
  }
}