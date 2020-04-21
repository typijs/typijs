import { ReflectiveInjector } from "injection-js";
import { ResolvePageProviders } from './modules/page/page-providers';
import { ResolveBlockProviders } from './modules/block/block-providers';
import { ResolveMediaProviders } from './modules/media/media-providers';

export const injector = ReflectiveInjector.fromResolvedProviders([
    ...ResolvePageProviders,
    ...ResolveBlockProviders,
    ...ResolveMediaProviders
]);