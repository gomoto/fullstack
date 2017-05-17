import * as express from 'express';
import {
  authenticationRequired,
  rolesRequired
} from '../../middleware';
import { settings } from '../../settings';

// Routes
import thing from './thing';

function apiRouter(): express.Router {
  const router = express.Router();

  // Require authentication for all routes.
  router.use('/', authenticationRequired(), rolesRequired([settings.apiRole]));

  // Routes
  router.use('/things', thing());

  return router;
}

export {
  apiRouter
}
