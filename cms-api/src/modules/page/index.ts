import { Provider } from 'injection-js';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PageRouter } from './page.route';

const PageProviders: Provider[] = [PageService, PageController, PageRouter]
export { PageService, PageController, PageRouter, PageProviders }