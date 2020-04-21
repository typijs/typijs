import * as morgan from 'morgan';

import { CONFIG } from '../config/config';
import { LogLevel } from '../constants/enums';
import { morganJsonFormat, MorganLogFormat, morganStream } from './morganHelper';

/**
 * Create a new morgan logger middleware
 * @returns morgan logger middleware
 */
export function loggingMiddleware() {

    let morganMiddleware;

    switch (CONFIG.LOG.LEVEL) {
        //Log all requests to winston
        case LogLevel.Debug: {
            morganMiddleware = morgan(morganJsonFormat, {
                stream: morganStream
            });
            break;
        }
        //log only 4xx and 5xx responses to winston
        case LogLevel.Error: {
            morganMiddleware = morgan(morganJsonFormat, {
                skip: function (req, res) { return res.statusCode < 400 },
                stream: morganStream
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
