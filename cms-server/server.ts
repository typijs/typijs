import { CmsApp, config, CmsStorageEngine, ImgurStorageEngine } from '@angular-cms/api';

const cmsApp = new CmsApp({
    provides: [
        //Default Angular Cms using disk storage to store the uploaded images.
        //It also support cloud storage such as Imgur
        //If you want to use Imgur as image storage, using this config as below
        //{ provide: CmsStorageEngine, useClass: ImgurStorageEngine }
    ]
});

cmsApp.start()
    .then(() => { console.log('Server started successfully!'); })
    .catch((err) => { console.error(err); })