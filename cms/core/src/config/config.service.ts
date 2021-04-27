import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { APP_BASE_URL, CONFIG_PATH } from '../injection-tokens';

export type Configuration = {
    baseApiUrl: string
};

const defaultConfig: Configuration = {
    baseApiUrl: 'http://localhost:3000/api'
};

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private configuration: Configuration;
    get baseApiUrl(): string {
        return this.configuration && this.configuration.baseApiUrl;
    }

    // Follow: https://github.com/alexzuza/angular-plugin-architecture/blob/master/src/app/services/plugins-config.provider.ts
    constructor(private http: HttpClient,
        // tslint:disable-next-line: ban-types
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(CONFIG_PATH) private configPath: string,
        @Inject(APP_BASE_URL) @Optional() private baseUrl: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.baseUrl = document.location.origin;
        }
    }

    loadConfig() {
        return this.http.get<Configuration>(`${this.baseUrl}${this.configPath}`);
    }

    setConfig(configuration: Configuration = defaultConfig) {
        this.configuration = configuration;
    }
}
