import express = require('express');
import * as mongodb from 'mongodb';
import { ThingControllerFactory } from './thing.controller';

export default (database: mongodb.Db) => {
  const router = express.Router();
  const controller = ThingControllerFactory(database);

  router.get('/', controller.index.bind(controller));
  router.get('/:id', controller.show.bind(controller));
  router.post('/', controller.create.bind(controller));
  router.put('/:id', controller.upsert.bind(controller));
  router.delete('/:id', controller.destroy.bind(controller));

  return router;
}
