import { Provider } from 'injection-js';
import { PageService, PageVersionService } from './page.service';
import { PageController } from './page.controller';
import { PageRouter } from './page.route';

const PageProviders: Provider[] = [PageService, PageVersionService, PageController, PageRouter]
export { PageService, PageVersionService, PageController, PageRouter, PageProviders }