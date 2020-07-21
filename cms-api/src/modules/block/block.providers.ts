import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRouter } from './block.route';

const BlockProviders: Provider[] = [BlockService, BlockController, BlockRouter]
export const ResolveBlockProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(BlockProviders);