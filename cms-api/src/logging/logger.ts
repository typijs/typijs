import * as winston from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');

import { CONFIG } from '../config/config';
import { HttpException } from '../errorHandling';
import { errorStackTracerFormat, getLogDir } from './winstonHelper';
import { MorganToken } from './morganHelper';

const logDir = getLogDir();

const options: winston.LoggerOptions = {
    level: CONFIG.LOG.LEVEL,
    exitOnError: true, //If false, handled exceptions will not cause process.exit
    format: winston.format.combine(
        winston.format.splat(),
        errorStackTracerFormat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} - ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new DailyRotateFile({
            handleExceptions: true,
            humanReadableUnhandledException: true,
            dirname: logDir,
            filename: 'angularcms.%DATE%.log', //Filename to be used to log to. This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename. (default: 'winston.log.%DATE%)
            datePattern: "YYYY-MM-DD",
            zippedArchive: true, //A boolean to define whether or not to gzip archived log files. (default 'false')
            maxSize: "20m", //Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number. (default: null)
            maxFiles: `${CONFIG.LOG.KEEP_IN_DAYS}d` //Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. (default: null)
        })
    ],
};

export const logger = winston.createLogger(options);

// logger.stream = <any>{
//     write: function (message, encoding) {
//         const messageObj: MorganToken = JSON.parse(message);

//         let code = messageObj.status;
//         if (code < 400) {
//             logger.info(`${code} - ${messageObj.url}`);
//         } else {
//             logger.error('', new HttpException(code, `${code} - ${messageObj.url}`));
//         }
//     }
// };

class LoggerStream {
    write(message: string) {
        const messageObj: MorganToken = JSON.parse(message);

        const httpStatus = messageObj.status;
        const errorMessage = `${httpStatus} - ${messageObj.method} - ${messageObj.url}`;
        if (httpStatus < 400) {
            logger.info(errorMessage);
        } else {
            logger.error('', new HttpException(httpStatus, errorMessage));
        }
    }
}

export const loggerStream = new LoggerStream();