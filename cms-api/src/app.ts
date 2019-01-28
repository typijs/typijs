import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

import apiRouter from './routes';
import * as errorHandler from './helpers/errorHandler';

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use('/', express.static(path.join(__dirname, '../public')));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    //this.express.use(helmet());
  }

  private setRoutes(): void {
    this.express.use('/api', apiRouter);
    this.express.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }
}