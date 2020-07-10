import { PLATFORM_ID, Injectable, Inject, Optional } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';

//export abstract class LocationRef extends Location { }
export type LocationRef = {
    /**
     * Ex: http://localhost:4200 or http://yourdomain.com
     */
    origin: string,
    /**
     * Ex: /path1/path2/path3
     */
    pathname: string,
    search: string
}

@Injectable({
    providedIn: 'root'
})
export class BrowserLocationService {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(REQUEST) private request?: any) { }

    getLocation(): LocationRef {
        if (isPlatformBrowser(this.platformId)) {
            return window.location;
        }

        if (isPlatformServer(this.platformId) && this.request) {
            return <LocationRef>{
                origin: `${this.request.protocol}://${this.request.get('host')}`,
                pathname: this.request.path
            };
        }

        return <LocationRef>{
            origin: '',
            pathname: ''
        };
    }

    getURLSearchParams(): URLSearchParams {
        const location = this.getLocation();
        return new URLSearchParams(location.search);
    }
}