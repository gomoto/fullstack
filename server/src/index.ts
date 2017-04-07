/**
 * Main application file
 */

import express = require('express');
import http = require('http');
import config from './config/environment';
import logger from './config/logger';
import configureExpress from './config/express';
import configureRoutes from './routes';
import configureMongo from './config/mongo';


const app = express() as express.Application;
const server = http.createServer(app);

// Connect to mongodb database once and reuse the connection.
// https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling
configureMongo(app)
.then((database) => {
  configureExpress(app);
  configureRoutes(app, database);
})
.then(() => {
  server.listen(config.port, config.ip, () => {
    logger.info(`Express server listening at ${config.ip}:${config.port}, in ${config.env} mode`);
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
