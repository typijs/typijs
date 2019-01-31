import * as mongoose from 'mongoose';
import { logger } from '../logging';
import { CONFIG } from '../config/config';

function getMongoConnection() {
    let AUTHENTICATION = '';
    if(CONFIG.MONGO.DB_USER && CONFIG.MONGO.DB_PASSWORD) {
        AUTHENTICATION = `${CONFIG.MONGO.DB_USER}:${CONFIG.MONGO.DB_PASSWORD}@`;
    }
    return `mongodb://${AUTHENTICATION}${CONFIG.MONGO.DB_HOST}:${CONFIG.MONGO.DB_PORT}/${CONFIG.MONGO.DB_NAME}`;
}

export const connectToTheDatabase = (async () => {
    try {
        var mongodbConnection = getMongoConnection();
        await mongoose.connect(mongodbConnection, { useNewUrlParser: true });
        console.log('Connected to MongoDB on', mongodbConnection);
        logger.info(`Connected to MongoDB on ${mongodbConnection}`);
      } catch (err) {
        console.log(`${err} Could not connect to the database. Exiting Now...`);
        logger.error(`${err} Could not connect to the database. Exiting Now...`);
        process.exit();
      }
})