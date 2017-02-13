import express = require('express');
import mongodb = require('mongodb');
import logger from './logger';
import config from './environment';


/**
 * Try to connect to a mongodb database.
 * If connection succeeds, resolve the returned promise; add the database to the
 * express application under the 'database' setting.
 * If connection fails, reject the returned promise.
 * @param  {express.Application} app
 * @return {Promise<void>}
 */
export default (app: express.Application) => {
  logger.info('Configuring mongodb');
  const mongoDatabase = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;
  return new Promise<mongodb.Db>((resolve, reject) => {
    mongodb.MongoClient.connect(mongoDatabase, (error, database) => {
      if(error) return reject(error);
      resolve(database);
    });
  })
  .then((database) => {
    logger.info(`Connected to ${mongoDatabase}`);
    app.set('database', database);
  })
  .catch((error) => {
    logger.info(`Failed to connect to ${mongoDatabase}`);
    return Promise.reject(error);
  });
};
