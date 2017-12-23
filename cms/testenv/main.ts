import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { TestenvModule } from './testenv.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(TestenvModule)
  .catch(err => console.log(err));
