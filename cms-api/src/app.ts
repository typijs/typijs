import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

import { httpLoggerMiddleware } from './logging';
import { connectToTheDatabase } from './db/dbConnect';

import { appRouter } from './routes';
import { errorMiddleware } from './errorHandling';

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();

    connectToTheDatabase();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandling();
  }

  private setMiddlewares(): void {
    this.express.use(cors({
      origin: 'http://localhost:4200'
    }));
    this.express.use(httpLoggerMiddleware());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    //this.express.use(helmet());
  }

  private setRoutes(): void {
    this.express.use('/', express.static(path.join(__dirname, '../public')));
    this.express.use('/api', appRouter);
    this.express.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  private setErrorHandling(): void {
    this.express.use(errorMiddleware);
  }
}