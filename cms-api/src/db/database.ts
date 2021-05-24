
import * as mongoose from 'mongoose';
import { logger } from '../logging';
import { config, MongoDbOptions, TenantDb } from '../config/config';
import { getCurrentTenantId } from './storage';

export class Database {
    private mongoDbOptions: MongoDbOptions;
    constructor(dbOptions?: MongoDbOptions) {
        this.mongoDbOptions = dbOptions ? { ...config.mongdb, ...dbOptions } : { ...config.mongdb };
    }

    public connect = async () => {
        try {
            const mongodbConnection = this.getMongoConnection();
            await mongoose.connect(mongodbConnection, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
            console.log('Connected to MongoDB on', mongodbConnection);
            logger.info(`Connected to MongoDB on ${mongodbConnection}`);
        } catch (err) {
            console.log(`${err} Could not connect to the database. Exiting Now...`);
            logger.error(`Could not connect to the database. Exiting Now...`, err);
            process.exit();
        }
    }

    private getMongoConnection = (): string => {
        const { user, password, protocol, host, name } = this.mongoDbOptions;
        let authentication = '';
        if (user && password) {
            authentication = `${user}:${password}@`;
        }
        return `${protocol}://${authentication}${host}/${name}`;
    }
}

export class TenantDatabases {
    private static multiTenantPool = {};

    static getMongoConnection = (tenantId): string => {
        const tenantDbs: TenantDb[] = config.mongdb.tenantDbs;
        const matchDb = tenantDbs.find(x => x.hosts.includes(tenantId));
        return matchDb?.dbConnection;
    }

    static getConnections(tenantId, modelName, schema): typeof mongoose {
        // Check connections lookup
        const mCon = this.multiTenantPool[tenantId];
        if (mCon) {
            if (!mCon.modelSchemas[modelName]) {
                mCon.model(modelName, schema);
            }
            return mCon;
        }

        const mongooseInstance = new mongoose.Mongoose();
        const url = this.getMongoConnection(tenantId);
        mongooseInstance
            .connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
            .catch(err => {
                logger.error(`Could not connect to the database. Exiting Now...`, err);
            });
        mongooseInstance.connection.on('error', err => logger.debug(err));
        mongooseInstance.connection.once('open', () => logger.info(`mongodb connected to ${url}`));

        this.multiTenantPool[tenantId] = mongooseInstance;
        // Create the model from schema
        mongooseInstance.model(modelName, schema);

        return mongooseInstance;
    };

    static getModelByTenant<D extends mongoose.Document<any>, M extends mongoose.Model<any>>(modelName: string, schema) {
        const tenantId = getCurrentTenantId();
        logger.info(`getModelByTenant tenantId : ${tenantId}.`);
        const tenantDb = this.getConnections(tenantId, modelName, schema);
        // Get the model which be created already
        return tenantDb.model<D, M>(modelName);
    };
}
