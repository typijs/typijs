import { CmsApp, config, CmsStorageEngine, ImgurStorageEngine } from '@angular-cms/api';

let app = new CmsApp({
    provides: [
        //Default Angular Cms using disk storage to store the uploaded images.
        //It also support cloud storage such as Imgur
        //If you want to use Imgur as image storage, using this config as below
        //{ provide: CmsStorageEngine, useClass: ImgurStorageEngine }
    ]
}).express;

app.listen(config.app.port, () => {
    console.log('Angular CMS listening on port ' + config.app.port);
});