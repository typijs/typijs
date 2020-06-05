import { ReflectiveInjector } from "injection-js";
import { ResolvePageProviders } from './modules/page/page.providers';
import { ResolveBlockProviders } from './modules/block/block.providers';
import { ResolveMediaProviders } from './modules/media/media.providers';

//TODO: should has the setting providers in app express to allow override
export const injector = ReflectiveInjector.fromResolvedProviders([
    ...ResolvePageProviders,
    ...ResolveBlockProviders,
    ...ResolveMediaProviders
]);