import express = require('express');
import * as mongodb from 'mongodb';
import { ThingControllerFactory } from './thing.controller';
import { permissionRequired } from '../../../middleware';

export default (database: mongodb.Db) => {
  const router = express.Router();
  const controller = ThingControllerFactory(database);

  router.get('/', permissionRequired('read:thing'), controller.index.bind(controller));
  router.get('/:id', permissionRequired('read:thing'), controller.show.bind(controller));
  router.post('/', permissionRequired('create:thing'), controller.create.bind(controller));
  router.put('/:id', permissionRequired('update:thing'), controller.upsert.bind(controller));
  router.delete('/:id', permissionRequired('delete:thing'), controller.destroy.bind(controller));

  return router;
}
