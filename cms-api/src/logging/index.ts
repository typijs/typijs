import { Provider } from 'injection-js';
import { Logger, logger } from './logger';
import { loggingMiddleware } from './logging.middleware';

const LoggerProviders: Provider[] = [Logger];
export { Logger, loggingMiddleware, logger, LoggerProviders }