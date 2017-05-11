import http = require('http');
import { settings } from './settings';
import logger from './components/logger';
import routes from './routes';
import * as mongo from './services/mongo';

import { app } from './app';
const server = http.createServer(app);

mongo.initialize(settings.mongo.url)
.then(() => {
  app.use(routes());
})
.then(() => {
  server.listen(settings.port, settings.ip, () => {
    logger.info(`Express server listening at ${settings.ip}:${settings.port}, in ${settings.env} mode`);
  });
})
.catch(() => {
  logger.info('Failed to start server');
});
