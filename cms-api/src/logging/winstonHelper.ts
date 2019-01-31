import * as winston from 'winston';
import * as fs from 'fs';
import { CONFIG } from '../config/config';

export const errorStackTracerFormat = winston.format(info => {
    if (info.stack) {
        info.message = `${info.message} \n${info.stack}`;
    }
    return info;
});

export function getLogDir() {
    const logDir = CONFIG.LOG.DIR;
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    return logDir;
}