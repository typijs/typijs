import * as mongoose from 'mongoose';
import { Logger } from '../logging';
import { ConfigManager } from '../config';
import { getCurrentTenantId } from './local-storage';
import { Container } from '../injector';

export type TenantDb = {
    /**
     * The db connection
     */
    dbConnection: string
    /**
     * The hosts can be connected to the db
     */
    hosts: string[]
}

export class TenantDatabases {
    private static tenantDbs: TenantDb[] = [];
    private static multiTenantPool = {};

    static setTenantDbsConfig(tenantConnects: string, tenantHosts: string) {
        const connections = tenantConnects.split('|');
        const hostGroups = tenantHosts.split('|')

        connections.forEach((connect, index) => {
            const hostGroup = index < hostGroups.length ? hostGroups[index] : '';
            this.tenantDbs.push({
                dbConnection: connect,
                hosts: hostGroup.split(',')
            })
        })
    }

    static getModelByTenant<D extends mongoose.Document<any>, M extends mongoose.Model<any>>(modelName: string, schema) {
        const tenantId = getCurrentTenantId();
        const tenantDb = this.getTenantDb(tenantId, modelName, schema);
        // Get the model which be created already
        return tenantDb.model<D, M>(modelName);
    };

    private static getConnectionByTenantId(tenantId: string): string {
        const matchDb = this.tenantDbs.find(x => x.hosts.includes(tenantId));
        return matchDb?.dbConnection;
    };

    private static getTenantDb(tenantId: string, modelName: string, schema): typeof mongoose {
        // Check connections lookup
        const mCon = this.multiTenantPool[tenantId];
        if (mCon) {
            if (!mCon.modelSchemas[modelName]) {
                mCon.model(modelName, schema);
            }
            return mCon;
        }

        const connection = this.getConnectionByTenantId(tenantId);
        const mongooseInstance = this.connectToMongoDb(connection);
        this.multiTenantPool[tenantId] = mongooseInstance;
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
                logger.error(`Could not connect to the database. Exiting Now...`, err);
            });

        return mongooseInstance;
    }
}
