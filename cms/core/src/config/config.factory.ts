
import { ObservableInput, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService, Configuration } from './config.service';

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
                    console.log('/=========ERROR IN LOAD CONFIG==========/');
                    console.log(error);
                    configService.setConfig();
                    if (error.status !== 404) {
                        resolve(false);
                    }
                    resolve(true);
                    return of({});
                })
            ).subscribe();
    });
}