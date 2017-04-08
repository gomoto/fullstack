import http = require('http');
import { settings } from './settings';
import logger from './components/logger';
import router from './router';
import * as mongo from './services/mongo';

import { app } from './app';
const server = http.createServer(app);

// Connect to mongodb database once and reuse the connection.
// https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling
mongo.initialize(settings.mongo.url)
.then((database) => {
  app.use(router(database));
})
.then(() => {
  server.listen(settings.port, settings.ip, () => {
    logger.info(`Express server listening at ${settings.ip}:${settings.port}, in ${settings.env} mode`);
  });
})
.catch(() => {
  logger.info('Failed to start server');
});
