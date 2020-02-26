import * as dotenv from 'dotenv';
import { LogLevel, NodeEnv } from '../constants/enums';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

export const CONFIG = {
    APP: {
        //predifined: 'development', 'test', 'production'
        ENV: process.env.NODE_ENV || NodeEnv.Development,
        PORT: process.env.PORT || '3000',
    },

    MONGO: {
        DB_HOST: process.env.MONGO_DB_HOST || 'localhost',
        DB_PORT: process.env.MONGO_DB_PORT || '27017',
        DB_NAME: process.env.MONGO_DB_NAME || 'angularcms',
        DB_USER: process.env.MONGO_DB_USER,
        DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
    },

    JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || 'jwt_please_change',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,

    LOG: {
        LEVEL: process.env.LOG_LEVEL || LogLevel.Error,
        DIR: process.env.LOG_DIR || 'logs',
        KEEP_IN_DAYS: process.env.LOG_KEEP_IN_DAYS || '30',

    }
};