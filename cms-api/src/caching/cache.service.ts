import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheManager } from "./cache.manager";

@Injectable()
export class CacheService {
    constructor(private readonly cache: CacheManager) { }

    /**
     * Get value from cache
     * @param cacheKey 
     * @param callback the function will be called to fill the cache in case cache missing
     * @param ttl Time to live in second
     */
    public get = async <T = unknown>(cacheKey: string, callback?: () => Promise<T>, ttl?: number): Promise<T> => {
        let value = this.cache.get(cacheKey)
        if (value) return value;

        if (callback) {
            console.log('cache miss ' + cacheKey);
            value = await callback();
            this.cache.set(cacheKey, value, ttl);
        }

        return value;
    }

    public del = (cacheKeys: string | string[]) => {
        this.cache.del(cacheKeys);
    }

    public delStartWith = (keyStartStr: string = '') => {
        if (!keyStartStr) return;

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(keyStartStr) === 0) {
                this.del(key);
            }
        }
    }

    public flush = () => {
        this.cache.flushAll();
    }

}