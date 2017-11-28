import * as express from 'express';

export default function setRoutes(app) {
    
  const router = express.Router();
  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
