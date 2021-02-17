import { InjectionToken } from '@angular/core';

import { configLoadFactory } from './config/config.factory';
import { ConfigService } from './config/config.service';
import { AuthService } from './auth/auth.service';
import { authCheckFactory } from './auth/auth.factory';

export const CONFIG_DEPS = new InjectionToken<(() => void)[]>('CONFIG_DEPENDENCIES');

// Use a factory that return an array of dependant functions to be executed
export function configDepsFactory(authService: AuthService, configService: ConfigService) {
    return [authCheckFactory(authService, configService)];
}

// https://medium.com/@gmurop/managing-dependencies-among-app-initializers-in-angular-652be4afce6f
export function cmsInitializer(configService: ConfigService, configDeps: (() => void)[]): () => Promise<any> {
    return (): Promise<any> => new Promise((resolve, reject) => {
        configLoadFactory(configService)()
            .then(data => {
                // Return resolved Promise when dependant functions are resolved
                return Promise.all(configDeps.map(dep => dep())); // configDeps received from the outside world
            })
            .then(() => {
                // Once configuration dependencies are resolved, then resolve factory
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
}
