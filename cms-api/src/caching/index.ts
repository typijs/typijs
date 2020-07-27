import { Provider } from 'injection-js';
import { CacheManager } from './cache.manager';
import { CacheService } from './cache.service';

const CacheProviders: Provider[] = [CacheManager, CacheService]
export { CacheManager, CacheService, CacheProviders }
