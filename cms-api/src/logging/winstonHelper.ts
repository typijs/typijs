import * as winston from 'winston';
import { Format } from 'logform';
import * as fs from 'fs';
import { CONFIG } from '../config/config';
const DailyRotateFile = require('winston-daily-rotate-file');

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

export function getTransports() {
    //should add config to enable other type of transports
    return [
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
}