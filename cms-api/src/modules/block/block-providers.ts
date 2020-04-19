import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

const BlockProviders: Provider[] = [BlockService, BlockController]
export const ResolveBlockProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(BlockProviders);