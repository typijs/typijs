import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';

import { connectToTheDatabase } from './db/dbConnect';
import { errorConverter, errorHandler } from './errorHandling';
import { loggingMiddleware } from './logging';
import { appRouter } from './routes';

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();

    this.setDatabaseConnection();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandling();
  }

  private setDatabaseConnection() {
    connectToTheDatabase();
  }

  private setMiddlewares(): void {
    this.express.use(cors({
      origin: 'http://localhost:4200'
    }));
    this.express.use(loggingMiddleware());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
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
    this.express.use(errorConverter);
    this.express.use(errorHandler);
  }
}