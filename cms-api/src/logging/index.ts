import { Provider } from 'injection-js';
import { Logger } from './logger';
import { loggingMiddleware } from './logging.middleware';

const LoggerProviders: Provider[] = [Logger];
export { Logger, loggingMiddleware, LoggerProviders }
export * from './profiler.decorator';