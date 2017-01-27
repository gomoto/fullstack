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
app.set('stormpathOnline', config.env === 'production');

configureExpress(app);
configureRoutes(app);

function launchServer() {
  server.listen(config.port, config.ip, () => {
    logger.info(`Express server listening at ${config.ip}:${config.port}, in ${config.env} mode`);
  });
}

if (app.enabled('stormpathOnline')) {
  logger.info('Awaiting stormpath');
  app.on('stormpath.ready', launchServer);
} else {
  launchServer();
}

export { app }

// Fix type error: "Property 'on' does not exist on type Application"
declare global {
  namespace Express {
    export interface Application {
      on(event: string, callback: Function): void;
    }
  }
}
