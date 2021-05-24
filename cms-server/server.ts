import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Logger, TypiJs, CmsStorageEngine, ImgurStorageEngine, Container } from '@typijs/api';
import { config } from './config';


export class ExpressServer {
    public express: express.Application;
    public typiJs: TypiJs;

    constructor() {
        this.express = express();
        this.typiJs = new TypiJs(this.express, config);

        this.setMiddlewares();
        this.setRoutes();
        this.setErrorHandling();
    }

    public start(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.express.listen(config.app.port, () => {
                console.log(`The CMS server listening on port ${config.app.port}`);
                resolve('Start successfully!');
            }).on('error', (err: any) => {
                Container.get(Logger).error('Server can not start', err);
                reject(err);
            });
        });
    }

    private setMiddlewares(): void {

        //enable CORS - Cross Origin Resource Sharing
        //https://expressjs.com/en/resources/middleware/cors.html
        this.express.use(cors({
            origin: config.app.origin.split(','), credentials: true
        }));
        // parse body params and attache them to req.body
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        //gzip compression
        //this.express.use(compress());
        //this.express.use(helmet());
    }

    private setRoutes(): void {
        this.express.use('/api', this.typiJs.apiRouter);
    }

    private setErrorHandling(): void {
        this.express.use(this.typiJs.errorHandler)
    }
}

const expressApp = new ExpressServer();
expressApp.start()
    .then(() => { console.log('Server started successfully!'); })
    .catch((err) => { console.error(err); })