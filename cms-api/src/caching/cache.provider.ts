import * as NodeCache from 'node-cache';

export abstract class CacheProvider {
    /**
     * Get a cached item from the key
     * @param key 
     * @returns get 
     */
    abstract get(key: string): any;
    /**
     * Insert the item to cache with provided key
     * @param key 
     * @param value 
     * @param [ttl] (default: `0`) The time to live in second. `0` = unlimited
     */
    abstract set(key: string, value: any, ttl?: number);
    abstract delete(keys: string | string[]);
    abstract clearAll();
    abstract keys(): string[];
}

/**
 * Default implement for cache provider using NodeCache lib
 */
export class NodeCacheProvider implements CacheProvider {
    private cache = new NodeCache();

    get(key: string): any {
        return this.cache.get(key);
    }

    set(key: string, value: any, ttl?: number) {
        this.cache.set(key, value, ttl);
    }

    delete(keys: string | string[]) {
        this.cache.del(keys);
    }

    keys(): string[] {
        return this.cache.keys();
    }

    clearAll() {
        this.cache.flushAll();
    }
}

