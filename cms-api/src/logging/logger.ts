import * as winston from 'winston';

import { CONFIG } from '../config/config';
import { errorStackTracerFormat, getTransports } from './winstonHelper';

const options: winston.LoggerOptions = {
    level: CONFIG.LOG.LEVEL,
    exitOnError: true, //If false, handled exceptions will not cause process.exit
    format: winston.format.combine(
        winston.format.splat(),
        errorStackTracerFormat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} - ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: getTransports()
};

export const logger = winston.createLogger(options);