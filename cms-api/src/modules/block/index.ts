import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRouter } from './block.route';

const BlockProviders: Provider[] = [BlockService, BlockController, BlockRouter]
export { BlockService, BlockController, BlockRouter, BlockProviders }