import 'reflect-metadata';
import { Injectable } from "injection-js";
import { CacheProvider } from "./cache.provider";
import { ParamNullException } from '../error';
import { isNilOrWhiteSpace } from '../utils';
import { TenantContext } from '../request-context';

@Injectable()
export class CacheService {
    constructor(private readonly cache: CacheProvider) { }

    public createCacheKey = (...args: string[]): string => {
        if (args.length == 0) throw new ParamNullException('args');

        const filteredArgs = args.filter(arg => !isNilOrWhiteSpace(arg));
        if (filteredArgs.length == 0) throw new ParamNullException('args');

        return `${filteredArgs.join(':')}`;
    }
    /**
     * Async get item from cache
     * @param cacheKey 
     * @param cacheMissCallback the `Promise` function will be called to fill the cache in case cache missing
     * @param [ttl] (default: `0`) The time to live in second. `0` = unlimited
     * @returns return `Promise` of item's value. Need use with `then()` or `await` to get value
     */
    public get = async <T = unknown>(cacheKey: string, cacheMissCallback?: () => Promise<T>, ttl?: number): Promise<T> => {

        cacheKey = this.getCacheKeyWithPrefixTenant(cacheKey);
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
     * @param cacheKey 
     * @param cacheMissCallback the function will be called to fill the cache in case cache missing
     * @param [ttl] (default: `0`) The time to live in second. `0` = unlimited
     * @returns Return the item's value
     */
    public getSync = <T = unknown>(cacheKey: string, cacheMissCallback?: () => T, ttl?: number): T => {
        cacheKey = this.getCacheKeyWithPrefixTenant(cacheKey);
        let value = this.cache.get(cacheKey)
        if (value) return value;

        if (cacheMissCallback) {
            console.log('cache miss ' + cacheKey);
            value = cacheMissCallback();
            this.set(cacheKey, value, ttl);
        }

        return value;
    }

    /**
     * Insert the item to cache with provided key
     * @param key 
     * @param value 
     * @param [ttl] (default: `0`) The time to live in second. `0` = unlimited
     */
    public set = (cacheKey: string, value: any, ttl?: number) => {
        cacheKey = this.getCacheKeyWithPrefixTenant(cacheKey);
        this.cache.set(cacheKey, value, ttl);
    }

    public delete = (cacheKeys: string | string[]) => {
        if (cacheKeys instanceof Array) {
            cacheKeys.forEach(key => key = this.getCacheKeyWithPrefixTenant(key));
        } else {
            cacheKeys = this.getCacheKeyWithPrefixTenant(cacheKeys);
        }
        this.cache.delete(cacheKeys);
    }

    public deleteStartWith = (keyStartStr: string) => {
        if (!keyStartStr) return;

        keyStartStr = this.getCacheKeyWithPrefixTenant(keyStartStr);
        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(keyStartStr) === 0) {
                this.cache.delete(key);
            }
        }
    }

    public clearAll = () => {
        this.cache.clearAll();
    }

    public getAll = () => {
        const keys = this.cache.keys();
        return keys.map(key => ({ key, value: this.cache.get(key) }))
    }

    private getCacheKeyWithPrefixTenant(cacheKey: string): string {
        const tenant = TenantContext.getCurrentTenantId();
        return isNilOrWhiteSpace(tenant) ? cacheKey : `${tenant}:${cacheKey}`;
    }
}