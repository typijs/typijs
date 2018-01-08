import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as logger from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

import { setRoutes } from './routes';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.load({ path: '.env' });

// Create Express server
const app = express();
// Express configuration
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let mongodbURI;
if (process.env.NODE_ENV === 'test') {
    mongodbURI = process.env.MONGODB_TEST_URI;
} else {
    mongodbURI = process.env.MONGODB_URI;
    app.use(logger('dev'));
}

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(mongodbURI, { useMongoClient: true });

console.log('MONGODB_URI: ',process.env.MONGODB_URI);
mongodb
    .then((db) => {
        console.log('Connected to MongoDB on', db.host + ':' + db.port);
    })
    .catch((err) => {
        console.log("MongoDB connection error. Please make sure MongoDB is running." + err);
    });

setRoutes(app);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(app.get('port'), () => {
    console.log('Angular CMS Prototype listening on port ' + app.get('port'));
});

module.exports = app;