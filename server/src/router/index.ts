/**
 * Application routes
 */

import express = require('express');
import mongodb = require('mongodb');
import * as sp from '../config/express-stormpath.d';
const expressStormpath = require('express-stormpath') as sp.ExpressStormpath;
import * as expressStormpathOffline from 'express-stormpath-offline';
import logger from '../config/logger';
import { settings } from '../config/settings';

// Routes
import thing from './api/thing';

// Router factory
export default (database: mongodb.Db) => {
  logger.info('Configuring routes');

  const router = express.Router();

  // Auth middleware
  let authenticationRequired: () => express.RequestHandler;
  let groupsRequired: (groups: string[], all?: boolean) => express.RequestHandler;
  if (settings.stormpathOnline) {
    authenticationRequired = () => expressStormpath.authenticationRequired;
    groupsRequired = expressStormpath.groupsRequired;
  } else {
    authenticationRequired = expressStormpathOffline.authenticationRequired;
    groupsRequired = expressStormpathOffline.groupsRequired;
  }

  // API routes
  router.use('/api', authenticationRequired());
  if (settings.apiGroups.length > 0) {
    router.use('/api', groupsRequired(settings.apiGroups, false));
  }

  // Admin routes
  router.use('/admin', authenticationRequired());
  if (settings.adminGroups.length > 0) {
    router.use('/admin', groupsRequired(settings.adminGroups, false));
  }

  // All routes
  router.use('/api/things', thing);
  router.use('/admin/things', thing);

  router.get('/version', (req, res) => {
    res.sendFile(`${settings.root}/git-sha.txt`);
  });

  // Routes for api and resources should have already been served.
  // Return a 404 for all undefined resource or api routes.
  router.route('/:url(api|resources)/*')
  .get((req, res) => {
    res.sendStatus(404);
  });

  // All other routes should redirect to the index.html
  router.route('/*')
  .get((req, res) => {
    res.render(settings.paths.application, {
      NODE_ENV: settings.env
    });
  });

  return router;
}
