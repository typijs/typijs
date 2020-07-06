import * as fs from 'fs';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { config } from '../config/config';

const getLogDir = () => {
    const logDir = config.log.folder;
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    return logDir;;
}

const winstonTransports: Transport[] = [
    new DailyRotateFile({
        handleExceptions: true,
        dirname: getLogDir(),
        filename: 'angularcms.%DATE%.log', //Filename to be used to log to. This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename. (default: 'winston.log.%DATE%)
        datePattern: "YYYY-MM-DD",
        zippedArchive: true, //A boolean to define whether or not to gzip archived log files. (default 'false')
        maxSize: "20m", //Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number. (default: null)
        maxFiles: `${config.log.keepLogsInDays}d`, //Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. (default: null)
        utc: true
    })
]

class Logger {
    private logger: winston.Logger;
    constructor() {
        const options: winston.LoggerOptions = {
            level: config.log.level,
            exitOnError: true, //If false, handled exceptions will not cause process.exit
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => {
                    const { timestamp, level, message, meta } = info;
                    return `${timestamp} - ${level.toUpperCase()}: ${message}`
                })
            ),
            transports: winstonTransports
        };
        this.logger = winston.createLogger(options);
    }

    trace(message: string, error?: Error) {
        if (error) message = `${message} \n${error.stack}`
        this.logger.log('trace', message);
    }

    debug(message: string, error?: Error) {
        if (error) message = `${message} \n${error.stack}`
        this.logger.debug(message);
    }

    info(message: string, error?: Error) {
        if (error) message = `${message} \n${error.stack}`
        this.logger.info(message);
    }

    warn(message: string, error?: Error) {
        if (error) message = `${message} \n${error.stack}`
        this.logger.warn(message);
    }

    error(message: string, error?: Error) {
        if (error) message = `${message} \n${error.stack}`
        this.logger.error(message);
    }

    fatal(message: string, error?: Error) {
        if (error) message = `${message} \n${error.stack}`
        this.logger.log('fatal', message);
    }
}

export const logger = new Logger();