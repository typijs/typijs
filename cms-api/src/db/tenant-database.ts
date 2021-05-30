import * as mongoose from 'mongoose';
import { Logger } from '../logging';
import { ConfigManager } from '../config';
import { Container } from '../injector';
import { TenantContext } from '../request-context';
import { Dictionary } from '../utils/dictionary';

export class TenantDatabases {
    private static multiTenantPool = {};
    private static hostDictinary: Dictionary<string> = {};

    static connect(tenantMongoDbConns: string, tenantHosts: string): void {
        const connections = tenantMongoDbConns.split('|');
        const hostGroups = tenantHosts.split('|')

        connections.forEach((mongoDbConn, index) => {
            const hostGroup = index < hostGroups.length ? hostGroups[index] : '';

            const hosts = hostGroup.split(',');
            hosts.forEach(host => this.hostDictinary[host] = mongoDbConn)

            this.multiTenantPool[mongoDbConn] = this.connectToMongoDb(mongoDbConn);
        })
    }

    static preCreateModel(modelName: string, schema): void {
        Object.keys(this.hostDictinary).forEach(host => {
            this.getTenantDb(host, modelName, schema);
        })
    }

    static getModelByTenant<D extends mongoose.Document<any>, M extends mongoose.Model<any>>(modelName: string, schema) {
        const tenantId = TenantContext.getCurrentTenantId();
        const tenantDb = this.getTenantDb(tenantId, modelName, schema);
        // Get the model which be created already
        return tenantDb.model<D, M>(modelName);
    };

    private static getTenantDb(tenantId: string, modelName: string, schema): typeof mongoose {
        // Check connections lookup
        const connection = this.hostDictinary[tenantId];
        const mCon = this.multiTenantPool[connection];
        if (mCon) {
            if (!mCon.modelSchemas[modelName]) {
                mCon.model(modelName, schema);
            }
            return mCon;
        }

        const mongooseInstance = this.connectToMongoDb(connection);
        this.multiTenantPool[connection] = mongooseInstance;
        // Create the model from schema
        mongooseInstance.model(modelName, schema);
        return mongooseInstance;
    };

    private static connectToMongoDb(connection: string): typeof mongoose {
        const mongooseInstance = new mongoose.Mongoose();
        const logger = Container.get(Logger);
        mongooseInstance
            .connect(connection, ConfigManager.getConfig().mongdb.connectOptions)
            .then(() => {
                console.log(`Connected to MongoDB on ${connection}`);
                logger.info(`Connected to MongoDB on ${connection}`);
            })
            .catch(err => {
                console.log(`Could not connect to the database ${connection}. Exiting Now...`);
                logger.error(`Could not connect to the database. Exiting Now...`, err);
            });

        return mongooseInstance;
    }
}
