import { App, CONFIG } from '@angular-cms/api';

let app = new App().express;

app.listen(CONFIG.APP.PORT, () => {
    console.log('Angular CMS listening on port ' + CONFIG.APP.PORT);
});