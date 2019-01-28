import * as dotenv from 'dotenv';
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

export const CONFIG = {
    APP: process.env.APP || 'development',
    PORT: process.env.PORT || '3000',

    DB_DIALECT: process.env.DB_DIALECT || 'mongo',
    DB_HOST: process.env.DB_HOST || 'mongodb://localhost:27017/angularcmsprototype',
    DB_NAME: process.env.DB_NAME || 'example_db',
    DB_PASSWORD: process.env.DB_PASSWORD || 'db-password',
    DB_PORT: process.env.DB_PORT || '27017',
    DB_USER: process.env.DB_USER || 'root',

    JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || 'jwt_please_change',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10
};