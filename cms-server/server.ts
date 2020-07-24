import { CmsApp, config, CmsStorageEngine, ImgurStorageEngine } from '@angular-cms/api';

let app = new CmsApp({
    provides: [
        { provide: CmsStorageEngine, useClass: ImgurStorageEngine }
    ]
}).express;

app.listen(config.app.port, () => {
    console.log('Angular CMS listening on port ' + config.app.port);
});