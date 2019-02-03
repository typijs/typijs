import * as morgan from 'morgan';
import { loggerStream } from './logger';
import { CONFIG } from '../config/config';
import { LogLevel } from '../constants/enums';
import { morganJsonFormat, MorganLogFormat } from './morganHelper';

export function httpLoggerMiddleware() {

    let morganMiddleware;

    switch (CONFIG.LOG.LEVEL) {
        //Log all requests to winston
        case LogLevel.Debug: {
            morganMiddleware = morgan(morganJsonFormat, { stream: loggerStream });
            break;
        }
        //log only 4xx and 5xx responses to winston
        case LogLevel.Error: {
            morganMiddleware = morgan(morganJsonFormat, {
                skip: function (req, res) {
                    return res.statusCode < 400
                },
                stream: loggerStream
            });
            break;
        }
        //Log all requests to console
        default: {
            morganMiddleware = morgan(MorganLogFormat.Dev);
            break;
        }
    }

    return morganMiddleware
}
