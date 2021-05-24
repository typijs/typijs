
import * as mongoose from 'mongoose';
import { Logger } from '../logging';
import { ConfigManager } from '../config';
import { Container } from '../injector';

export class Database {
    static async connect(dbConnection: string) {
        const logger = Container.get(Logger);
        try {
            await mongoose.connect(dbConnection, ConfigManager.getConfig().mongdb.connectOptions);
            console.log('Connected to MongoDB on', dbConnection);
            logger.info(`Connected to MongoDB on ${dbConnection}`);
        } catch (err) {
            console.log(`${err} Could not connect to the database. Exiting Now...`);
            logger.error(`Could not connect to the database. Exiting Now...`, err);
            process.exit();
        }
    }
}