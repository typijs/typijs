import * as dotenv from 'dotenv';
import * as path from 'path';
import { LogLevel, NodeEnv } from '../constants/enums';

// Load environment variables from .env file, where API keys and passwords are configured
// predefined: 'development', 'test', 'production'
dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV || NodeEnv.Development}.env`)
});

export const config = {
    app: {
        env: process.env.NODE_ENV || NodeEnv.Development,
        port: process.env.PORT || '3000',
        origin: process.env.ORIGIN || 'http://localhost:4200,http://localhost:4202'
    },
    mongdb: {
        protocol: process.env.MONGO_DB_PROTOCOL || 'mongodb+srv', //'mongodb',
        host: process.env.MONGO_DB_HOST || 'cluster0.6s8ha.azure.mongodb.net',//'localhost:27017',
        name: process.env.MONGO_DB_NAME || 'vegefoods_v2', //angularcms
        user: process.env.MONGO_DB_USER || 'dbAdmin',
        password: process.env.MONGO_DB_PASSWORD || '02091945m'
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
    },
    imgur: {
        baseUrl: 'https://api.imgur.com',
        clientId: 'your client id',
        clientSecret: 'your client secret',
        refreshToken: 'your refresh token',
        accessToken: 'your access token'
    }
};
