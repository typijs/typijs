import * as NodeCache from 'node-cache';

export interface ICacheManager {
    get(key: string): any;
    set(key: string, value: any, ttl?: number);
    delete(keys: string | string[]);
    keys(): string[];
    flushAll();
}

export class CacheManager implements ICacheManager {
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

    flushAll() {
        this.cache.flushAll();
    }
}

