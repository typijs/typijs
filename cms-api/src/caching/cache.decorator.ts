import { Container } from '../injector';
import { Validator } from '../validation';
import { CacheService } from './cache.service';

export type SuffixKeyBuilder = (args: any[]) => string;
export type CacheOptions = {
    prefixKey?: string;
    suffixKey?: string | SuffixKeyBuilder;
    ttl?: number;
}

const defaultOptions: CacheOptions = { prefixKey: '', suffixKey: '', ttl: 0 }

/**
 * Cache - This decorator allows you to first check if cached results for the
 *             decorated method exist. If so, return those, else run the decorated
 *             method, cache its return value, then return that value.
 *
 * @param options {CacheOptions}
 */
export function Cache(cacheOptions?: CacheOptions) {

    const { prefixKey, suffixKey, ttl } = Object.assign(defaultOptions, cacheOptions ? cacheOptions : {});

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Ensure we have the descriptor that might been overriden by another decorator
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        if (!descriptor || (typeof descriptor.value !== 'function')) {
            throw new TypeError(`Only methods can be decorated with @Cache. <${propertyKey}> is not a method!`);
        }

        const originalMethod = descriptor.value;
        // Redefine the method to this new method who will call the original method
        // Use the function's this context instead of the value of this when log is called (no arrow function)
        descriptor.value = async function (...args: any[]) {
            const cacheService = Container.get(CacheService);
            Validator.throwIfNull('cacheService', cacheService);

            const suffixKeys = suffixKey instanceof Function ? suffixKey(args) : suffixKey;
            const cacheKey = cacheService.createCacheKey(prefixKey, propertyKey, suffixKeys);
            const cacheValue = await cacheService.get(cacheKey);
            if (cacheValue) {
                return cacheValue;
            }

            const result = await originalMethod.apply(this, args); // Call the original method
            cacheService.set(cacheKey, result, ttl);
            return result;
        }
    }
}