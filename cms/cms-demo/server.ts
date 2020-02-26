import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
    const server = express();

    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/cms-demo-server/main');
    const distFolder = join(process.cwd(), 'dist/cms-demo');

    server.engine('html', ngExpressEngine({
        bootstrap: AppServerModuleNgFactory,
        providers: [provideModuleMap(LAZY_MODULE_MAP)]
    }));

    // register the template engine
    server.set('view engine', 'html');
    // specify the views directory
    server.set('views', distFolder);

    // TODO: implement data requests securely
    server.get('/api/*', (req, res) => {
        res.status(404).send('data requests are not supported');
    });

    server.get('/cms/*', (req, res) => {
        res.sendFile(join(distFolder, 'index.html'));
    });

    // Serve static files from /browser
    server.get('*.*', express.static(distFolder, {
        maxAge: '1y'
    }));

    // All regular routes use the Universal engine
    server.get('*', (req, res) => {
        res.render('index', { req, res });
    });

    return server;
}

//enableProdMode();
const port = process.env.PORT || 4200;

// Start up the Node server
const server = app();
server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
});