import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

export type Configuration = {
    baseApiUrl: string
}

const defaultConfig: Configuration = {
    baseApiUrl: 'http://localhost:3000/api'
}

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private readonly CONFIG_PATH: string = '/assets/config.json';
    private configuration: Configuration;
    get baseApiUrl(): string {
        return this.configuration && this.configuration.baseApiUrl;
    }

    //Follow: https://github.com/alexzuza/angular-plugin-architecture/blob/master/src/app/services/plugins-config.provider.ts
    constructor(private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject('APP_BASE_URL') @Optional() private baseUrl: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.baseUrl = document.location.origin;
        }
    }

    loadConfig() {
        return this.http.get<Configuration>(`${this.baseUrl}${this.CONFIG_PATH}`)
    }

    setConfig(configuration: Configuration = defaultConfig) {
        this.configuration = configuration;
    }
}