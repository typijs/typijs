import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine, RenderOptions } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

export function detectBot(userAgent: string): boolean {
    if (!userAgent) return false;

    //See more at https://user-agents.net/bots 
    //or https://github.com/monperrus/crawler-user-agents/blob/master/crawler-user-agents.json
    const bots = [
        'googlebot', 'Google-Site-Verification', 'google page speed', 'lighthouse',
        'AdsBot', 'APIs-Google', 'Feedfetcher-Google', 'Mediapartners-Google', 'HeadlessChrome', 'developers.google.com/+/web/snippet',
        'yandexbot', 'yahoo', 'bingbot',
        'baiduspider', 'facebookexternalhit', 'twitterbot', 'rogerbot',
        'linkedinbot', 'embedly', 'quora link preview', 'showyoubot', 'outbrain',
        'pinterest/0.', 'nuzzel', 'discordbot',
        'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot',
        'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview',
        'SkypeUriPreview', 'AppInsights', 'PhantomJS'
    ];

    const agent: string = userAgent.toLowerCase();
    for (const bot of bots) {
        if (agent.indexOf(bot.toLowerCase()) > -1) {
            console.log('BOT DETECTED: ' + bot);
            return true;
        }
    }
    return false;
}

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
    const server = express();

    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/cms-demo-server/main');
    const distFolder = join(process.cwd(), 'dist/cms-demo');

    server.engine('html', (_, options: RenderOptions, callback) => {
        const protocol = options.req.protocol;
        const host = options.req.get('host');

        const engine = ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [
                provideModuleMap(LAZY_MODULE_MAP),
                { provide: 'APP_BASE_URL', useFactory: () => `${protocol}://${host}`, deps: [] },
            ]
        });
        engine(_, options, callback);
    });

    // server.engine('html', ngExpressEngine({
    //     bootstrap: AppServerModuleNgFactory,
    //     providers: [provideModuleMap(LAZY_MODULE_MAP)]
    // }));

    // register the template engine
    server.set('view engine', 'html');
    // specify the views directory
    server.set('views', distFolder);
    // Ignore the router to /cms/* in angular universal
    server.get('/cms/*', (req, res) => {
        res.sendFile(join(distFolder, 'index.html'));
    });

    // Serve static files from ./dist/cms-demo folder
    server.get('*.*', express.static(distFolder, {
        maxAge: '1y'
    }));

    // All regular routes use the Universal engine
    server.get('*', (req, res) => {
        const isBot = detectBot(req.get('user-agent') || '');
        if (isBot) {
            // select the the index file in views folder
            res.render('index', { req, res });
        } else {
            res.sendFile(join(distFolder, 'index.html'));
        }
    });

    return server;
}

//enableProdMode();
const port = process.env.PORT || 4200;

// Start up the Node server
const server = app();
server.listen(port, () => {
    console.log(`Node Express for SSR  listening on http://localhost:${port}`);
});