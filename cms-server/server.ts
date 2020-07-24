import { App, config, STORAGE_ENGINE, ImgurMulterStorageEngine } from '@angular-cms/api';

let app = new App({
    provides: [
        //{ provide: STORAGE_ENGINE, useClass: ImgurMulterStorageEngine }
    ]
}).express;

app.listen(config.app.port, () => {
    console.log('Angular CMS listening on port ' + config.app.port);
});