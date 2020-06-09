import * as mongoose from 'mongoose';
import { logger } from '../logging';
import { config } from '../config/config';

function getMongoConnection() {
  let authentication = '';
  if (config.mongoose.dbUser && config.mongoose.dbPassword) {
    authentication = `${config.mongoose.dbUser}:${config.mongoose.dbPassword}@`;
  }
  return `mongodb://${authentication}${config.mongoose.host}:${config.mongoose.port}/${config.mongoose.dbName}`;
}

export const connectToTheDatabase = (async () => {
  try {
    const mongodbConnection = getMongoConnection();
    await mongoose.connect(mongodbConnection, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
    console.log('Connected to MongoDB on', mongodbConnection);
    logger.info(`Connected to MongoDB on ${mongodbConnection}`);
  } catch (err) {
    console.log(`${err} Could not connect to the database. Exiting Now...`);
    logger.error(`Could not connect to the database. Exiting Now...`, err);
    process.exit();
  }
})