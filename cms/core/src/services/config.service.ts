import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export type Configuration = {
    baseApiUrl: string,
    appUrl: string
}

export function configLoadFactory(configService: ConfigService) {
    return (): Promise<boolean> => {
        return new Promise<boolean>((resolve: (a: boolean) => void): void => {
            configService.loadConfig()
                .pipe(
                    map((configJson: Configuration) => {
                        configService.setConfig(configJson);
                        resolve(true);
                    }),
                    //this 'config.json' file won’t be available is when we are using ng serve during development.
                    catchError((error: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
                        if (error.status !== 404) {
                            resolve(false);
                        }
                        const defaultConfig = {
                            baseApiUrl: 'http://localhost:3000/api',
                            appUrl: 'http://localhost:4200'
                        }
                        configService.setConfig(defaultConfig);
                        resolve(true);
                        return of({});
                    })
                ).subscribe();
        });
    };
}

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private configuration: Configuration;

    constructor(private http: HttpClient) { }

    get baseApiUrl(): string {
        return this.configuration.baseApiUrl;
    }

    get appUrl(): string {
        return this.configuration.appUrl;
    }

    loadConfig() {
        return this.http.get<Configuration>('/assets/config.json')
    }

    setConfig(configuration: Configuration) {
        this.configuration = configuration;
    }
}