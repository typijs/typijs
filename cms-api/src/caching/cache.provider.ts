import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { CacheManager } from './cache.manager';
import { CacheService } from './cache.service';

const CacheProviders: Provider[] = [CacheManager, CacheService]
export const ResolveCacheProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(CacheProviders);