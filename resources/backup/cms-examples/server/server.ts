import { App, config } from '@angular-cms/api';

let app = new App().express;

app.listen(config.app.port, () => {
    console.log('Angular CMS Prototype listening on port ' + config.app.port);
});