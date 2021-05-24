import { TypiJsConfig } from '@typijs/api';
import * as dotenv from 'dotenv';
import * as path from 'path';

/*
process.env.NODE_ENV

There is also a built-in environment variable called NODE_ENV. 
You can read it from process.env.NODE_ENV. 

*/

/*
dotenv - Load environment variables from .env file

What happens to environment variables that were already set?

We will never modify any environment variables that have already been set. 
In particular, if there is a variable in your .env file which collides with one that already exists in your environment, then that variable will be skipped. 
This behavior allows you to override all .env configurations with a machine-specific environment, although it is not recommended.
*/
dotenv.config({
    path: path.resolve(process.cwd(), `${process.env.NODE_ENV || 'development'}.env`)
});

/* 
You can override these values by define in development.env in local, or production.env in production mode
*/
export const config: TypiJsConfig = {
    app: {
        env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '3000',
        origin: process.env.ORIGIN || 'http://localhost:4200,http://localhost:4202'
    },
    mongdb: {
        connection: process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/vegefoods_v2',
        multiTenant: JSON.parse(process.env.MONGODB_TENANT || 'false'),
        // the multil MongonDb connections seperate by '|' char
        tenantConnects: process.env.MONGODB_TENANT_CONNECTS || 'mongodb://localhost:27017/tenant_1|mongodb://localhost:27017/tenant_2',
        // the multil host groups are corresponding to each connection seperate by '|' char, each host in group is seperate by comma 
        tenantHosts: process.env.MONGODB_TENANT_HOSTS || 'localhost:3000,localhost:3030|localhost:4000'
    },
    jwt: {
        secret: process.env.JWT_SECRET || '1878B83DE0384DE08D3F69FE1C308D55',
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 15,
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
        resetPasswordExpirationMinutes: 10,
    },
    log: {
        level: process.env.LOG_LEVEL || 'error',
        folder: process.env.LOG_FOLDER || 'logs',
        fileName: process.env.LOG_FILE_NAME || 'typijs',
        keepLogsInDays: process.env.LOG_KEEP_IN_DAYS || 30,
    },
    media: {
        uploadFolder: process.env.MEDIA_UPLOAD_FOLDER || 'uploads',
        thumbnailSize: process.env.MEDIA_THUMBNAIL_SIZE || 'w=50&h=50',
    },
    imgur: {
        baseUrl: process.env.IMGUR_URL || 'https://api.imgur.com',
        clientId: process.env.IMGUR_CLIENT_ID || 'your client id',
        clientSecret: process.env.IMGUR_CLIENT_SECRET || 'your client secret',
        refreshToken: process.env.IMGUR_REFRESH_TOKEN || 'your refresh token',
        accessToken: process.env.IMGUR_ACCESS_TOKEN || 'your access token'
    },
    provides: [
        //Default Angular Cms using disk storage to store the uploaded images.
        //It also support cloud storage such as Imgur
        //If you want to use Imgur as image storage, using this config as below
        //{ provide: CmsStorageEngine, useClass: ImgurStorageEngine }
    ]
};