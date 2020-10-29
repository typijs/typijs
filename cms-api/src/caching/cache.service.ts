import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheManager } from "./cache.manager";

@Injectable()
export class CacheService {
    constructor(private readonly cache: CacheManager) { }

    /**
     * Async get item from cache
     * @param cacheKey 
     * @param cacheMissCallback the function will be called to fill the cache in case cache missing
     * @param ttl Time to live in second
     * @returns return `Promise` of item's value. Need use with `then()` or `await` to get value
     */
    public get = async <T = unknown>(cacheKey: string, cacheMissCallback?: () => Promise<T>, ttl?: number): Promise<T> => {
        let value = this.cache.get(cacheKey)
        if (value) return value;

        if (cacheMissCallback) {
            console.log('cache miss ' + cacheKey);
            value = await cacheMissCallback();
            this.set(cacheKey, value, ttl);
        }

        return value;
    }

    /**
     * Sync get item from cache
     * @returns Return the item's value
     */
    public getSync = <T = unknown>(cacheKey: string, cacheMissCallback?: () => T, ttl?: number): T => {
        let value = this.cache.get(cacheKey)
        if (value) return value;

        if (cacheMissCallback) {
            console.log('cache miss ' + cacheKey);
            value = cacheMissCallback();
            this.set(cacheKey, value, ttl);
        }

        return value;
    }

    public set = (cacheKey: string, value: any, ttl?: number) => {
        this.cache.set(cacheKey, value, ttl);
    }

    public delete = (cacheKeys: string | string[]) => {
        this.cache.delete(cacheKeys);
    }

    public deleteStartWith = (keyStartStr: string = '') => {
        if (!keyStartStr) return;

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(keyStartStr) === 0) {
                this.delete(key);
            }
        }
    }

    public flushAll = () => {
        this.cache.flushAll();
    }

}