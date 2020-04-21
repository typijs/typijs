import * as fs from 'fs';
import * as winston from 'winston';
import * as Transport from 'winston-transport';

import { CONFIG } from '../config/config';

const DailyRotateFile = require('winston-daily-rotate-file');
const enumerateErrorFormat = winston.format(info => {
    if (info instanceof Error) {
        Object.assign(info, { message: `${info.message} \n${info.stack}` });
    }
    return info;
});

const getLogDir = () => {
    const logDir = CONFIG.LOG.DIR;
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    return logDir;;
}

const winstonTransports: Transport[] = [
    new DailyRotateFile({
        handleExceptions: true,
        humanReadableUnhandledException: true,
        dirname: getLogDir(),
        filename: 'angularcms.%DATE%.log', //Filename to be used to log to. This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename. (default: 'winston.log.%DATE%)
        datePattern: "YYYY-MM-DD",
        zippedArchive: true, //A boolean to define whether or not to gzip archived log files. (default 'false')
        maxSize: "20m", //Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number. (default: null)
        maxFiles: `${CONFIG.LOG.KEEP_IN_DAYS}d` //Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. (default: null)
    })
]

const options: winston.LoggerOptions = {
    level: CONFIG.LOG.LEVEL,
    exitOnError: true, //If false, handled exceptions will not cause process.exit
    format: winston.format.combine(
        winston.format.splat(),
        enumerateErrorFormat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} - ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: winstonTransports
};

export const logger = winston.createLogger(options);