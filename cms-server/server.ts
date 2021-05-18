// import { CmsApp, config, CmsStorageEngine, ImgurStorageEngine } from '@typijs/api';

// const cmsApp = new CmsApp({
//     provides: [
//         //Default Angular Cms using disk storage to store the uploaded images.
//         //It also support cloud storage such as Imgur
//         //If you want to use Imgur as image storage, using this config as below
//         //{ provide: CmsStorageEngine, useClass: ImgurStorageEngine }
//     ]
// });

// cmsApp.start()
//     .then(() => { console.log('Server started successfully!'); })
//     .catch((err) => { console.error(err); })

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { CmsAppOptions, config, logger, loggingMiddleware, TypiJs } from '@typijs/api';

export const ApplicationConfig: CmsAppOptions = {
    provides: [
        //Default Angular Cms using disk storage to store the uploaded images.
        //It also support cloud storage such as Imgur
        //If you want to use Imgur as image storage, using this config as below
        //{ provide: CmsStorageEngine, useClass: ImgurStorageEngine }
    ]
}

export class ExpressServer {
    public express: express.Application;
    public typiJs: TypiJs;

    constructor() {
        this.express = express();
        //Init provider, init bindCurrentNamespace middleware for local storage
        // connect db
        this.typiJs = new TypiJs(this.express, ApplicationConfig);

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
        this.express.use('/api', this.typiJs.router);
    }

    private setErrorHandling(): void {
        this.express.use(this.typiJs.errorHandler)
    }
}

const expressApp = new ExpressServer();
expressApp.start()
    .then(() => { console.log('Server started successfully!'); })
    .catch((err) => { console.error(err); })