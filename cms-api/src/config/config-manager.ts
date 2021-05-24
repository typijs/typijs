import { Provider } from 'injection-js';
import { LogLevel, NodeEnv } from '../constants/enums';
import { Validator } from '../validation';


export class MongoDbConfig {

    connection?: string;
    multiTenant?: boolean | string;
    // the multil MongonDb connections seperate by '|' char
    tenantConnects?: string;
    // the multil host groups are corresponding to each connection seperate by '|' char, each host in group is seperate by comma 
    tenantHosts?: string;
    connectOptions?: { [key: string]: any }

    static validate(config: MongoDbConfig): boolean {
        if (config.multiTenant) {
            Validator.throwIfNullOrEmpty('MongoDb.tenantConnects', config.tenantConnects);
            Validator.throwIfNullOrEmpty('MongoDb.tenantHosts', config.tenantHosts);
        } else {
            Validator.throwIfNullOrEmpty('MongoDb.connection', config.connection);
        }

        return true;
    }
}

export class JwtConfig {
    secret?: string;
    accessExpirationMinutes?: number | string;
    refreshExpirationDays?: number | string;
    resetPasswordExpirationMinutes?: number | string;
    static validate(config: JwtConfig): boolean {
        Validator.throwIfNullOrEmpty('jwt.secret', config.secret);
        Validator.throwIfNullOrEmpty('jwt.accessExpirationMinutes', `${config.accessExpirationMinutes}`);
        Validator.throwIfNullOrEmpty('jwt.refreshExpirationDays', `${config.refreshExpirationDays}`);
        Validator.throwIfNullOrEmpty('jwt.resetPasswordExpirationMinutes', `${config.resetPasswordExpirationMinutes}`);

        return true;
    }
}

export class LogConfig {
    level?: string;
    folder?: string;
    fileName?: string;
    keepLogsInDays?: number | string;
    static validate(config: LogConfig): boolean {
        Validator.throwIfNullOrEmpty('log.level', config.level);
        Validator.throwIfNullOrEmpty('log.folder', `${config.folder}`);
        Validator.throwIfNullOrEmpty('log.fileName', config.fileName);
        Validator.throwIfNullOrEmpty('log.keepLogsInDays', `${config.keepLogsInDays}`);

        return true;
    }
}

export class MediaConfig {
    uploadFolder?: string;
    thumbnailSize?: string;

    static validate(config: MediaConfig): boolean {
        Validator.throwIfNullOrEmpty('media.uploadFolder', config.uploadFolder);
        Validator.throwIfNullOrEmpty('media.thumbnailSize', `${config.thumbnailSize}`);

        return true;
    }
}

export interface ImgurConfig {
    baseUrl?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    accessToken?: string;
}

export interface TypiJsConfig {
    mongdb?: MongoDbConfig;
    jwt?: JwtConfig;
    log?: LogConfig;
    media?: MediaConfig;
    imgur?: ImgurConfig;
    provides?: Provider[];
    [key: string]: any;
}

export class ConfigManager {
    private static typijsConfig: TypiJsConfig;
    private static defaultConfig: TypiJsConfig = {
        mongdb: {
            multiTenant: false,
            // Mongoose connection options
            connectOptions: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        },
        jwt: {
            secret: '1878B83DE0384DE08D3F69FE1C308D55',
            accessExpirationMinutes: 15,
            refreshExpirationDays: 30,
            resetPasswordExpirationMinutes: 10,
        },
        log: {
            level: LogLevel.Error,
            folder: 'logs',
            fileName: 'typijs',
            keepLogsInDays: 30,
        },
        media: {
            uploadFolder: 'uploads',
            thumbnailSize: 'w=50&h=50',
        }
    };

    static setConfig(config: TypiJsConfig) {
        const { mongdb, jwt, log, media, imgur } = config || {};
        this.typijsConfig = {
            mongdb: { ...this.defaultConfig.mongdb, ... (mongdb || {}) },
            jwt: { ...this.defaultConfig.jwt, ...(jwt || {}) },
            log: { ...this.defaultConfig.log, ...(log || {}) },
            media: { ...this.defaultConfig.media, ...(media || {}) },
            imgur
        }

        MongoDbConfig.validate(this.typijsConfig.mongdb);
        JwtConfig.validate(this.typijsConfig.jwt);
        LogConfig.validate(this.typijsConfig.log);
        MediaConfig.validate(this.typijsConfig.media);
    }

    static getConfig(): TypiJsConfig {
        return this.typijsConfig;
    }

    static getEnv(): string {
        return process.env.NODE_ENV || NodeEnv.Development;
    }
}


