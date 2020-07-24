import { ReflectiveInjector, Provider } from "injection-js";

import { ResolveCacheProviders } from "./caching";
import { ResolveAuthProviders } from "./modules/auth/auth.provider";
import { ResolveBlockProviders } from './modules/block/block.providers';
import { ResolveMediaProviders, StorageProviders } from './modules/media/media.providers';
import { ResolvePageProviders } from './modules/page/page.providers';
import { ResolveSiteDefinitionProviders } from "./modules/site-definition/site-definition.provider";
import { ResolveUserProviders } from "./modules/user/user.provider";
import { AppRouter } from "./routes";

export const AppProviders: Provider[] = [AppRouter, ...StorageProviders]

export class AppInjector {
    constructor(private providers?: Provider[]) { }

    get instance(): ReflectiveInjector {
        let globalProviders = [...AppProviders];
        if (this.providers) {
            globalProviders = [...AppProviders, ...this.providers];
        }
        return ReflectiveInjector.fromResolvedProviders([
            ...ResolveCacheProviders,
            ...ResolvePageProviders,
            ...ResolveBlockProviders,
            ...ResolveMediaProviders,
            ...ResolveSiteDefinitionProviders,
            ...ResolveUserProviders,
            ...ResolveAuthProviders,
            ...ReflectiveInjector.resolve(globalProviders)
        ]);
    }
}

//TODO: should has the setting providers in app express to allow override
export const injector = ReflectiveInjector.fromResolvedProviders([
    ...ResolveCacheProviders,
    ...ResolvePageProviders,
    ...ResolveBlockProviders,
    ...ResolveMediaProviders,
    ...ResolveSiteDefinitionProviders,
    ...ResolveUserProviders,
    ...ResolveAuthProviders,
    ...ReflectiveInjector.resolve(AppProviders)
]);