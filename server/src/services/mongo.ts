import * as mongodb from 'mongodb';
import * as deepExtend from 'deep-extend';

import logger from '../components/logger';
const logPrefix = `[mongo]`;

/**
 * MongoDB database connection, which is null until connected.
 * "Connect to mongodb database once and reuse the connection."
 * https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling
 */
let _database: mongodb.Db = null;

function getDatabase(): mongodb.Db {
  return _database;
}

/**
 * Try to connect to a mongodb database.
 * Retry until connected or until maximum tries are exhausted.
 * If connection succeeds, resolve returned promise with the database object.
 * If connection fails, reject returned promise with the connection error.
 * @param {string} url URL to the mongodb database
 * @param {MongoInitializationOptions} options mongodb initialization options
 * @return {Promise<mongodb.Db>}
 */
function initialize(url: string, options?: MongoInitializationOptions): Promise<mongodb.Db> {
  logger.info(logPrefix, 'Initializing');

  // Unpack options.
  options = deepExtend<MongoInitializationOptions, MongoInitializationOptions>({
    reconnectInterval: 1000,
    reconnectTries: 30
  }, options);

  // Promise to connect.
  return new Promise<mongodb.Db>(function connectWithRetry(resolve, reject) {
    logger.debug(logPrefix, 'Connecting to database');
    let reconnectTry = 0;
    mongodb.MongoClient.connect(url, (error, database) => {
      if (error) {
        console.error(`Failed to connect to ${url}.`);
        console.error(`Retrying in ${options.reconnectInterval/1000} seconds.`);
        if (reconnectTry++ < options.reconnectTries) {
          // Try again.
          setTimeout(() => connectWithRetry(resolve, reject), options.reconnectInterval);
        } else {
          // Enough trying. Time to give up.
          reject(error);
        }
        return;
      }
      _database = database;
      resolve(database);
    });
  })
  .then((database) => {
    logger.info(logPrefix, `Connected to ${url}`);
    return database;
  })
  .catch((error) => {
    logger.info(logPrefix, `Failed to connect to ${url} after ${options.reconnectTries} attempts`);
    return Promise.reject(error);
  });
}

export interface MongoInitializationOptions {
  /**
  * Interval (milliseconds) at which to attempt reconnecting.
  * @type {number}
  */
  reconnectInterval: number;

  /**
  * Number of reconnection attempts before giving up.
  * @type {number}
  */
  reconnectTries: number;
}

export {
  getDatabase,
  initialize
}
