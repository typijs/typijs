import { ReflectiveInjector, Provider } from "injection-js";

import { CacheProviders } from "./caching";
import { AuthProviders } from "./modules/auth";
import { BlockProviders } from './modules/block';
import { MediaProviders, StorageProviders } from './modules/media';
import { PageProviders } from './modules/page';
import { SiteDefinitionProviders } from "./modules/site-definition";
import { UserProviders } from "./modules/user";
import { CmsApiRouter } from "./routes";

export class CmsInjector {
    constructor(private providers?: Provider[]) { }

    get instance(): ReflectiveInjector {
        let appProviders = [
            ...CacheProviders,
            ...AuthProviders,
            ...BlockProviders,
            ...MediaProviders,
            ...StorageProviders,
            ...PageProviders,
            ...SiteDefinitionProviders,
            ...UserProviders,
            CmsApiRouter
        ];
        if (this.providers) {
            appProviders = [...appProviders, ...this.providers];
        }
        return ReflectiveInjector.fromResolvedProviders([...ReflectiveInjector.resolve(appProviders)]);
    }
}