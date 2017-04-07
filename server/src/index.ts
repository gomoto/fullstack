/**
 * Main application file
 */

import express = require('express');
import http = require('http');
import { settings } from './config/settings';
import logger from './config/logger';
import configureExpress from './config/express';
import router from './routes';
import configureMongo from './config/mongo';


const app = express() as express.Application;
const server = http.createServer(app);

// Connect to mongodb database once and reuse the connection.
// https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling
configureMongo(app)
.then((database) => {
  configureExpress(app);

  // Application routes
  app.use(router(database));
})
.then(() => {
  server.listen(settings.port, settings.ip, () => {
    logger.info(`Express server listening at ${settings.ip}:${settings.port}, in ${settings.env} mode`);
  });
})
.catch(() => {
  logger.info('Failed to start server because database is down');
});

export { app }


// Fix type error: "Property 'on' does not exist on type Application"
declare global {
  namespace Express {
    export interface Application {
      on(event: string, callback: Function): void;
    }
  }
}
