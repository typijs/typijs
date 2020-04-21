import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

const MediaProviders: Provider[] = [MediaService, MediaController]
export const ResolveMediaProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(MediaProviders);