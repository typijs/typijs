import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';

import { connectToTheDatabase } from './db/dbConnect';
import { errorConverter, errorHandler } from './errorHandling';
import { loggingMiddleware } from './logging';
import { AppRouter } from './routes';
import { injector } from './injector';

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
    connectToTheDatabase();
  }

  private setMiddlewares(): void {
    //enable CORS - Cross Origin Resource Sharing
    //https://expressjs.com/en/resources/middleware/cors.html
    this.express.use(cors({
      origin: 'http://localhost:4200', credentials: true
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
    this.express.use('/', express.static(path.join(__dirname, '../public')));
    this.express.use('/api', appRouter);
    this.express.get('/*', function (req: express.Request, res: express.Response) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  private setErrorHandling(): void {
    //add middleware to convert all errors to AppError class
    this.express.use(errorConverter);
    //handler for all errors
    this.express.use(errorHandler);
  }
}