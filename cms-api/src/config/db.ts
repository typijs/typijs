import * as mongoose from 'mongoose';
import { CONFIG } from './config';

mongoose.set('useCreateIndex', true);

// Connecting to the database
export default (async () => {
    try {
        await mongoose.connect(
            CONFIG.DB_HOST,
            { useNewUrlParser: true }
        );
        // listen for requests
        console.log('Connected to MongoDB on', CONFIG.DB_HOST);
    } catch (err) {
        console.log(`${err} Could not Connect to the Database. Exiting Now...`);
        process.exit();
    }
})();