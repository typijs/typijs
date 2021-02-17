import { PLATFORM_ID, Injectable, Inject, Optional } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';

// export abstract class LocationRef extends Location { }
export type LocationRef = {
    /**
     * Get full hostname including port number and protocol (http: or https:)
     *
     * Ex: http://yourdomain:4200/path1/path2?query --> http://localhost:4200
     */
    origin: string,
    /**
     * Get hostname including port number
     * Ex: http://yourdomain:4200/path1/path2?query --> yourdomain:4200
     */
    host: string,
    /**
     * Get hostname without port number
     *
     * Ex: http://yourdomain:4200/path1/path2?query --> yourdomain
     */
    hostname: string,
    /**
     * Get pathname of url
     *
     * Ex: http://yourdomain:4200/path1/path2?query --> /path1/path2
     */
    pathname: string,
    /**
     * Get query string
     *
     * Ex: http://yourdomain:4200/path1/path2?param1=value1&param2=value2 --> ?param1=value1&param2=value2
     */
    search: string
};

@Injectable({
    providedIn: 'root'
})
export class BrowserLocationService {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(REQUEST) private request?: any) { }

    /**
     * Get url information.
     *
     * In browser, it get from window.location object
     *
     * In server, it get from the request object
     */
    getLocation(): LocationRef {
        if (isPlatformBrowser(this.platformId)) {
            return window.location;
        }

        if (isPlatformServer(this.platformId) && this.request) {
            return <LocationRef>{
                origin: `${this.request.protocol}://${this.request.get('host')}`,
                host: `${this.request.get('host')}`,
                hostname: `${this.request.get('hostname')}`,
                pathname: this.request.path
            };
        }

        return <LocationRef>{
            origin: '',
            host: '',
            hostname: '',
            pathname: ''
        };
    }

    /**
     * Get query params
     *
     * Ex: http://yourdomain:4200/path1?param1=value1&param2=value2
     * ```
     * const params = new URLSearchParams('?param1=value1&param2=value2');
     * const value1 = params.get('param1');
     * const value2 = params.get('param2');
     * ```
     */
    getURLSearchParams(): URLSearchParams {
        const location = this.getLocation();
        return new URLSearchParams(location.search);
    }
}
