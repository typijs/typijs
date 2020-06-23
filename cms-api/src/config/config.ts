import * as dotenv from 'dotenv';
import { LogLevel, NodeEnv } from '../constants/enums';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

export const config = {
    app: {
        //predefined: 'development', 'test', 'production'
        env: process.env.NODE_ENV || NodeEnv.Development,
        port: process.env.PORT || '3000',
    },

    mongoose: {
        host: process.env.MONGO_DB_HOST || 'localhost',
        port: process.env.MONGO_DB_PORT || '27017',
        dbName: process.env.MONGO_DB_NAME || 'angularcms',
        dbUser: process.env.MONGO_DB_USER,
        dbPassword: process.env.MONGO_DB_PASSWORD,
    },

    jwt: {
        secret: process.env.JWT_SECRET || '1878B83DE0384DE08D3F69FE1C308D55',
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || '15',
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || '30',
        resetPasswordExpirationMinutes: 10,
    },

    log: {
        level: process.env.LOG_LEVEL || LogLevel.Error,
        folder: process.env.LOG_DIR || 'logs',
        keepLogsInDays: process.env.LOG_KEEP_IN_DAYS || '30',
    }
};