import { Provider } from 'injection-js';
import { BlockService, BlockVersionService } from './block.service';
import { BlockController } from './block.controller';
import { BlockRouter } from './block.route';

const BlockProviders: Provider[] = [BlockService, BlockVersionService, BlockController, BlockRouter]
export { BlockService, BlockVersionService, BlockController, BlockRouter, BlockProviders }