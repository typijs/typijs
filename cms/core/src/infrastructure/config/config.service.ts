import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type Configuration = {
    baseApiUrl: string,
    appUrl: string
}

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private readonly CONFIG_PATH: string = '/assets/config.json';
    private configuration: Configuration;

    constructor(private http: HttpClient) { }

    get baseApiUrl(): string {
        return this.configuration.baseApiUrl;
    }

    get appUrl(): string {
        return this.configuration.appUrl;
    }

    loadConfig() {
        return this.http.get<Configuration>(this.CONFIG_PATH)
    }

    setConfig(configuration: Configuration) {
        this.configuration = configuration;
    }
}