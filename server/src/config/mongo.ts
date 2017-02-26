import express = require('express');
import mongodb = require('mongodb');
import logger from './logger';
import config from './environment';


const mongoDatabase = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;
const reconnectInterval = 1000;
const reconnectTries = 30;
let reconnectCounter = 0;


/**
 * Try to connect to a mongodb database.
 * Retry until connected or until maximum tries are exhausted.
 * If connection succeeds, resolve the returned promise; add the database to the
 * express application under the 'database' setting.
 * If connection fails, reject the returned promise.
 * @param  {express.Application} app
 * @return {Promise<void>}
 */
export default (app: express.Application) => {
  logger.info('Configuring mongodb');
  return new Promise<mongodb.Db>(function connectWithRetry(resolve, reject) {
    mongodb.MongoClient.connect(mongoDatabase, (error, database) => {
      if (error) {
        console.error(`Failed to connect to ${mongoDatabase}.`);
        console.error(`Retrying in ${reconnectInterval/1000} seconds.`);
        if (reconnectCounter++ < reconnectTries) {
          // Try again.
          setTimeout(() => connectWithRetry(resolve, reject), reconnectInterval);
        } else {
          // Enough trying. It's over.
          reject(error);
        }
        return;
      }
      resolve(database);
    });
  })
  .then((database) => {
    logger.info(`Connected to ${mongoDatabase}`);
    app.set('database', database);
  })
  .catch((error) => {
    logger.info(`Failed to connect to ${mongoDatabase} after ${reconnectTries} attempts`);
    return Promise.reject(error);
  });
};
