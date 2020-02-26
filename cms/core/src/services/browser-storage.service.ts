import { Injectable, Inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

//export abstract class StorageRef extends Storage { }
export interface StorageRef {
    getItem(key: string);
    setItem(key: string, value: string);
    removeItem(key: string);
    clear();
}

export function localStorageFactory(platformId: Object): StorageRef {
    if (isPlatformBrowser(platformId)) {
        return localStorage;
    } else {
        return <StorageRef>{
            clear: () => {/*noop*/ },
            getItem: (key: string) => undefined as string,
            key: (index: number) => undefined as string,
            removeItem: (key: string) => {/*noop*/ },
            setItem: (key: string, value: string) => {/*noop*/ },
            length: 0
        };
    }
}

export const LOCAL_STORAGE = new InjectionToken<StorageRef>('LOCAL_STORAGE');

@Injectable({
    providedIn: 'root'
})
export class BrowserStorageService {
    constructor(@Inject(LOCAL_STORAGE) public storage: StorageRef) { }

    get(key: string): string {
        return this.storage.getItem(key);
    }

    set(key: string, value: string) {
        this.storage.setItem(key, value);
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }
}