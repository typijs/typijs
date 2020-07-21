import { ReflectiveInjector } from "injection-js";

import { ResolveCacheProviders } from "./caching";
import { ResolveAuthProviders } from "./modules/auth/auth.provider";
import { ResolveBlockProviders } from './modules/block/block.providers';
import { ResolveMediaProviders } from './modules/media/media.providers';
import { ResolvePageProviders } from './modules/page/page.providers';
import { ResolveSiteDefinitionProviders } from "./modules/site-definition/site-definition.provider";
import { ResolveUserProviders } from "./modules/user/user.provider";
import { AppRouter } from "./routes";


//TODO: should has the setting providers in app express to allow override
export const injector = ReflectiveInjector.fromResolvedProviders([
    ...ReflectiveInjector.resolve([AppRouter]),
    ...ResolveCacheProviders,
    ...ResolvePageProviders,
    ...ResolveBlockProviders,
    ...ResolveMediaProviders,
    ...ResolveSiteDefinitionProviders,
    ...ResolveUserProviders,
    ...ResolveAuthProviders
]);