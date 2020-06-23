
import { ObservableInput, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService, Configuration } from './config.service';

const defaultConfig: Configuration = {
    baseApiUrl: 'http://localhost:3000/api',
    appUrl: 'http://localhost:4200'
}

export function configLoadFactory(configService: ConfigService): () => Promise<boolean> {
    return () => new Promise<boolean>((resolve, reject) => {
        configService.loadConfig()
            .pipe(
                map((configJson: Configuration) => {
                    configService.setConfig(configJson);
                    resolve(true);
                }),

                //this 'config.json' file won’t be available is when we are using ng serve during development.
                catchError((error: { status: number }): ObservableInput<{}> => {
                    if (error.status !== 404) {
                        resolve(false);
                    }
                    configService.setConfig(defaultConfig);
                    resolve(true);
                    return of({});
                })
            ).subscribe();
    });
}