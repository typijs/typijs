import { App, CONFIG } from '@angular-cms/api';

let app = new App().express;

app.listen(CONFIG.PORT, () => {
    console.log('Angular CMS Prototype listening on port ' + CONFIG.PORT);
});