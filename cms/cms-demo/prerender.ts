import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { writeFileSync } from 'fs';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/cms-demo-server/main');


renderModuleFactory(AppServerModuleNgFactory, {
    document: '<app-root></app-root>',
    url: '/',
    extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
})
    .then(html => {
        console.log('Pre-rendering successful, saving prerender.html');
        writeFileSync('./cms-demo/prerender.html', html);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });