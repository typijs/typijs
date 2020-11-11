import { Provider } from 'injection-js';
import { CacheProvider, NodeCacheProvider } from './cache.provider';
import { CacheService } from './cache.service';

const CacheInjectorProviders: Provider[] = [CacheService, { provide: CacheProvider, useClass: NodeCacheProvider }]
export { CacheProvider, CacheService, CacheInjectorProviders }
