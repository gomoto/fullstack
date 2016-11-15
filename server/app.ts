/**
 * Main application file
 */

import express = require('express');
import http = require('http');
import config from './config/environment';
import logger from './config/logger';
import configureExpress from './config/express';
import configureRoutes from './routes';


const app = express() as express.Application;
const server = http.createServer(app);

logger.info('Configuring express');
configureExpress(app);

logger.info('Setting up routes');
configureRoutes(app);

logger.info('Starting server');
app.on('stormpath.ready', () => {
  server.listen(config.port, config.ip, () => {
    logger.info(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
  });
});

// Expose app
exports = module.exports = app;

// Fix type error: "Property 'on' does not exist on type Application"
declare global {
  namespace Express {
    export interface Application {
      on(event: string, callback: Function): void;
    }
  }
}
