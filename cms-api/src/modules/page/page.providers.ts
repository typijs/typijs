import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { PageService } from './page.service';
import { PageController } from './page.controller';

const PageProviders: Provider[] = [PageService, PageController]
export const ResolvePageProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(PageProviders);